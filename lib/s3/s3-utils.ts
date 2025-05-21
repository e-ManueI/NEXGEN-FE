/**
 * Strips the S3 URL from a given URL.
 * @param {string} url The URL to strip the S3 URL from.
 * @returns {string} The stripped S3 URL.
 * @example
 * stripS3Url("https://example.com/folder/your/object.txt") => "folder/your/object.txt"
 * stripS3Url("https://example.com/\"folder/your/object.txt\"") => "folder/your/object.txt"
 * stripS3Url("https://example.com//folder/your/object.txt") => "folder/your/object.txt"
 */
export const stripS3Url = (url: string): string => {
  try {
    // new URL() will throw if it’s not a valid http(s) URL
    const u = new URL(url);
    // u.pathname is “/folder/your/object.txt”
    return u.pathname.replace(/^\//, "");
  } catch {
    // fallback: remove leading slashes or quotes
    return url.replace(/^\/+|^"+|"+$/g, "");
  }
};
