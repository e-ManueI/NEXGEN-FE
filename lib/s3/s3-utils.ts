/**
 * Strips the S3 URL from a given URL.
 *
 * @param {string} url The URL to strip the S3 URL from.
 * @returns {string} The stripped S3 URL.
 */
export const stripS3Url = (url: string): string => {
  const match = url.match(/https:\/\/[^\/]+\/(.+)/);
  // If there is a match, return the first group (i.e. the path after the bucket name)
  // Otherwise, return the original URL
  return match ? match[1] : url;
};
