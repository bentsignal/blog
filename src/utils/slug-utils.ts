import { NextRequest } from "next/server";

export const getSlugFromRequest = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isStatic =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");
  if (isStatic) return null;

  const isRoot = pathname === "/";
  if (isRoot) return null;

  const isOnlySlug = pathname.split("/").filter(Boolean).length === 1;
  if (!isOnlySlug) return null;

  return pathname.split("/")[1];
};
