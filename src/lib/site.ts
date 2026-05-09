const PROD_ORIGIN = "https://blog.bentsignal.com";
const PORTLESS_NAME = "blog.bentsignal.localhost";

export const siteOrigin = PROD_ORIGIN;

export function isInternalUrl(url: string): boolean {
  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("//")
  ) {
    return true;
  }
  try {
    const parsed = new URL(url, PROD_ORIGIN);
    if (parsed.hostname === "blog.bentsignal.com") return true;
    if (parsed.hostname.endsWith(PORTLESS_NAME)) return true;
    return false;
  } catch {
    return true;
  }
}
