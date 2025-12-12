import type { ChannelSlug } from "@/blog/channels";
import type { PostSlug } from "@/blog/posts";
import { channelSlugs } from "@/blog/channels";
import { postSlugs } from "@/blog/posts";

export const getSlugFromPathname = (pathname: string) => {
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

export const findChannelWithSlug = (slug?: string | null) => {
  if (!slug) return undefined;
  if (channelSlugs.includes(slug as ChannelSlug)) return slug as ChannelSlug;
  return undefined;
};

export const findPostWithSlug = (slug?: string | null) => {
  if (!slug) return undefined;
  if (postSlugs.includes(slug as PostSlug)) return slug as PostSlug;
  return undefined;
};
