import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

// extend dayjs once at module load
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Formats an ISO timestamp into:
 *  - `tz`:   your detected IANA timezone
 *  - `formatted`: human‐readable date in that zone
 *  - `fromNow`:   relative time string (“2 days ago”)
 *
 * @param {string} isoTs  ISO‐8601 timestamp, e.g. "2025-05-07T21:35:56.519Z"
 * @returns {{ tz: string, formatted: string, fromNow: string }}
 */
interface FormattedTimestamp {
  tz: string;
  formatted: string;
  fromNow: string;
}

export function formatTimestamp(isoTs: string): FormattedTimestamp {
  // Detect user’s current timezone
  const tz = dayjs.tz.guess();

  // Parse + convert to local zone
  const zoned = dayjs(isoTs).tz(tz);

  return {
    tz,
    formatted: zoned.format("MMMM D, YYYY h:mm A"),
    fromNow: dayjs(isoTs).fromNow(),
  };
}

export const getDateRange = (range: string | null) => {
  const now = new Date();
  let startDate: Date;

  switch (range) {
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      startDate = new Date(
        now.setFullYear(now.getFullYear(), now.getMonth() - 1),
      );
      break;
    case "year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(0); // All time
  }

  return { startDate, endDate: new Date() };
};
