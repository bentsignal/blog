import { channels, type ChannelSlug } from "@/data/channels";
import { posts, type PostSlug } from "@/data/posts";
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

export const validateChannelSlug = (slug?: string | null) => {
  if (!slug) return undefined;
  if (slug in Object.keys(channels)) return slug as ChannelSlug;
  return undefined;
};

export const validatePostSlug = (slug?: string | null) => {
  if (!slug) return undefined;
  if (slug in Object.keys(posts)) return slug as PostSlug;
  return undefined;
};
