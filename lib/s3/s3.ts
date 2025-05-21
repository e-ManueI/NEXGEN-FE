"use server";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { stripS3Url } from "./s3-utils";

// Ensure required environment variables are defined
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
} = process.env;

if (
  !AWS_REGION ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_BUCKET_NAME
) {
  throw new Error("Missing required AWS environment variables.");
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Reads a readable stream and returns a promise that resolves to the
 * string representation of the stream's contents.
 *
 * @param stream - The readable stream to read from.
 * @returns A promise that resolves to the string representation of the
 * stream's contents.
 */
const streamToString = async (stream: Readable): Promise<string> => {
  /**
   * Array to store the stream's chunks. Each chunk is a Uint8Array.
   */
  const chunks: Uint8Array[] = [];

  /**
   * Iterate over the stream, and for each chunk, add it to the chunks array.
   */
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array);
  }

  /**
   * Concatenate the chunks into a single buffer, and convert it to a string.
   * The encoding is set to "utf-8".
   */
  return Buffer.concat(chunks).toString("utf-8");
};

/**
 * Fetches an object from an S3 bucket and returns its content as a string.
 *
 * @param key - The key of the object to fetch from the S3 bucket.
 * @returns A promise that resolves to the string content of the S3 object.
 * @throws Will throw an error if the response body is not a readable stream.
 */
export const fetchS3Object = async (key: string): Promise<string> => {
  // Create a command to get the object from the specified S3 bucket using the provided key
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });

  // Send the command to the S3 client and await the response
  const response = await s3Client.send(command);

  // Check if the response body is present and is a readable stream
  if (!response.Body || !(response.Body instanceof Readable)) {
    throw new Error("Expected response body to be a readable stream.");
  }

  // Convert the readable stream to a string and return it
  return streamToString(response.Body);
};

/**
 * Safely fetches a string from an S3 bucket using the provided path.
 * If the path is invalid or the fetch operation fails, returns null.
 *
 * @param {string | null | undefined} path - The optional S3 path to fetch the object from.
 * @returns {Promise<string | null>} A promise that resolves to the fetched string or null if the fetch fails.
 */
export async function safeFetch(path?: string | null): Promise<string | null> {
  // Return null if the path is not provided
  if (!path) return null;

  // Trim the path to remove any leading or trailing whitespace
  const trimmed = path.trim();

  // Remove accidental surrounding quotes from the path
  const unquoted =
    trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed.slice(1, -1)
      : trimmed;

  // Extract the key from the S3 URL
  const key = stripS3Url(unquoted);
  if (!key) return null; // Return null if the key is empty

  try {
    // Fetch the object from S3 using the extracted key
    return await fetchS3Object(key);
  } catch (err) {
    // Log the error and return null if the fetch operation fails
    console.error("S3 fetch failed for key:", key, err);
    return null;
  }
}

/**
 * Uploads a string (e.g. JSON) to S3 under the given URL or key.
 *
 * @param path – Full S3 URL (https://…/bucket/key) or raw key (folder/file.json)
 * @param body – String payload to upload (e.g. serialized JSON)
 * @param contentType – MIME type (defaults to application/json)
 */
export async function uploadS3Object(
  path: string,
  body: string | Buffer,
  contentType = "application/json",
): Promise<void> {
  const key = stripS3Url(path);
  if (!key) {
    throw new Error(`Invalid S3 path: "${path}"`);
  }

  const cmd = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  try {
    await s3Client.send(cmd);
    console.log(`Uploaded to s3://${AWS_BUCKET_NAME}/${key}`);
  } catch (err) {
    console.error("S3 upload failed for key:", key, err);
    throw err;
  }
}
