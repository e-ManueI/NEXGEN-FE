"use server";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

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
