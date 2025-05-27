import { db } from "@/app/_db";
import { ChartTimeRangeEnum, UserType } from "@/app/_db/enum";
import { predictionResult, reviewedPredictionResult } from "@/app/_db/schema";
import {
  failure,
  forbidden,
  success,
  unauthorized,
  notFound,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { sql, count } from "drizzle-orm";

/**
 * Handles GET requests for admin prediction statistics.
 *
 * This endpoint is protected and only accessible to authenticated users with the ADMIN role.
 * It returns chart data representing the number of new predictions and reviewed predictions
 * over a specified time range (last 7 days, 30 days, or 3 months).
 *
 * ## Steps performed:
 * 1. **Authentication & Authorization**:
 *    - Checks if the user is authenticated.
 *    - Ensures the user has the ADMIN role; otherwise, returns a forbidden error.
 *
 * 2. **Time Range Handling**:
 *    - Reads the `timeRange` query parameter (defaults to last 3 months).
 *    - Calculates the `startDate` and `endDate` for the query window.
 *
 * 3. **Database Queries**:
 *    - Fetches the count of new predictions per day from the `prediction_result` table,
 *      grouped by date, within the selected time range.
 *    - Fetches the count of reviewed predictions per day from the `reviewed_prediction_result` table,
 *      grouped by date, within the same time range.
 *
 * 4. **No Data Handling**:
 *    - If both queries return no results, responds with a `notFound` error.
 *
 * 5. **Data Merging**:
 *    - Initializes a map for each date in the range, defaulting counts to zero.
 *    - Populates the map with counts from both queries, ensuring all dates in the range are represented.
 *
 * 6. **Response Formatting**:
 *    - Converts the merged map to a sorted array of chart data objects.
 *    - Returns the chart data and selected time range in a success response.
 *
 * 7. **Error Handling**:
 *    - Catches and logs any errors, returning a failure response with status 500.
 *
 * @param req - The incoming request object, containing authentication and URL info.
 * @returns A JSON response with chart data for predictions and reviewed predictions per day,
 *          or an error response if not authorized or no data found.
 */
export const GET = auth(async (req) => {
  if (!req.auth) {
    return unauthorized();
  }

  if (req.auth.user.role !== UserType.ADMIN) {
    return forbidden("Access denied: Required role missing", 403);
  }

  try {
    const { searchParams } = new URL(req.url);
    const timeRange =
      searchParams.get("timeRange") || ChartTimeRangeEnum.LAST_3MONTHS;

    let daysToSubtract = 90;
    if (timeRange === ChartTimeRangeEnum.LAST_30DAYS) {
      daysToSubtract = 30;
    } else if (timeRange === ChartTimeRangeEnum.LAST_7DAYS) {
      daysToSubtract = 7;
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysToSubtract);

    // Fetch new predictions grouped by date within the selected time range
    const newPredictions = await db
      .select({
        date: sql<string>`DATE(${predictionResult.createdAt})`.as("date"),
        count: count(predictionResult.id).as("count"),
      })
      .from(predictionResult)
      .where(
        sql`${predictionResult.createdAt} >= ${startDate.toISOString()} AND ${predictionResult.createdAt} <= ${endDate.toISOString()}`,
      )
      .groupBy(sql`DATE(${predictionResult.createdAt})`);

    const reviewedPredictions = await db
      .select({
        date: sql<string>`DATE(${reviewedPredictionResult.createdAt})`.as(
          "date",
        ),
        count: count(reviewedPredictionResult.id).as("count"),
      })
      .from(reviewedPredictionResult)
      .where(
        sql`${reviewedPredictionResult.createdAt} >= ${startDate.toISOString()} AND ${reviewedPredictionResult.createdAt} <= ${endDate.toISOString()}`,
      )
      .groupBy(sql`DATE(${reviewedPredictionResult.createdAt})`);

    // Fetch approved reviewed prediction results
    const approvedReviewedPredictions = await db
      .select({
        date: sql<string>`DATE(${reviewedPredictionResult.createdAt})`.as(
          "date",
        ),
        count: count(reviewedPredictionResult.id).as("count"),
      })
      .from(reviewedPredictionResult)
      .where(
        sql`${reviewedPredictionResult.createdAt} >= ${startDate.toISOString()} AND ${reviewedPredictionResult.createdAt} <= ${endDate.toISOString()} AND ${reviewedPredictionResult.isApproved} = true`,
      )
      .groupBy(sql`DATE(${reviewedPredictionResult.createdAt})`);

    // If all are empty, treat as not found
    if (
      (!newPredictions || newPredictions.length === 0) &&
      (!reviewedPredictions || reviewedPredictions.length === 0) &&
      (!approvedReviewedPredictions || approvedReviewedPredictions.length === 0)
    ) {
      return notFound("No prediction stats found for the selected range");
    }

    const mergedDataMap = new Map<
      string,
      {
        date: string;
        predictions: number;
        reviewedPredictions: number;
        approvedReviewedPredictions: number;
      }
    >();

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      mergedDataMap.set(dateString, {
        date: dateString,
        predictions: 0,
        reviewedPredictions: 0,
        approvedReviewedPredictions: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    newPredictions.forEach((row) => {
      const dateKey = row.date;
      const existing = mergedDataMap.get(dateKey) || {
        date: dateKey,
        predictions: 0,
        reviewedPredictions: 0,
        approvedReviewedPredictions: 0,
      };
      existing.predictions = Number(row.count);
      mergedDataMap.set(dateKey, existing);
    });

    reviewedPredictions.forEach((row) => {
      const dateKey = row.date;
      const existing = mergedDataMap.get(dateKey) || {
        date: dateKey,
        predictions: 0,
        reviewedPredictions: 0,
        approvedReviewedPredictions: 0,
      };
      existing.reviewedPredictions = Number(row.count);
      mergedDataMap.set(dateKey, existing);
    });

    approvedReviewedPredictions.forEach((row) => {
      const dateKey = row.date;
      const existing = mergedDataMap.get(dateKey) || {
        date: dateKey,
        predictions: 0,
        reviewedPredictions: 0,
        approvedReviewedPredictions: 0,
      };
      existing.approvedReviewedPredictions = Number(row.count);
      mergedDataMap.set(dateKey, existing);
    });

    const chartData = Array.from(mergedDataMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Return the chart data and time range in the response
    return success({ chartData, timeRange });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return failure("Failed to fetch prediction stats", 500);
  }
});
