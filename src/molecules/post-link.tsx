"use client";

import Link from "next/link";
import type { PostSlug } from "@/blog/posts";
import { findChannelWithSlug } from "@/utils/slug-utils";
import * as Chat from "@/features/chat/atom";

export default function PostLink({
  slug,
  children,
}: {
  slug: PostSlug;
  children: React.ReactNode;
}) {
  const setCurrentChannelSlug = Chat.useStore((s) => s.setCurrentChannelSlug);

  return (
    <Link
      onClick={() => {
        const channelSlug = findChannelWithSlug(slug);
        if (channelSlug) {
          setCurrentChannelSlug(channelSlug);
        }
      }}
      prefetch={true}
      href={`/${slug}`}
    >
      {children}
    </Link>
  );
}
