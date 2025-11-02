import { NextRequest, NextResponse } from "next/server";
import { getSlugFromRequest } from "./utils/slug-utils";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const slug = getSlugFromRequest(request);
  if (slug) {
    response.headers.set("x-slug", slug);
  }

  return response;
}
