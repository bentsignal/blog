"use client";

import { useChatWindow } from "@/context/chat-window-context";
import { PostSlug } from "@/data/posts";
import { findChannelWithSlug } from "@/utils/slug-utils";
import Link from "next/link";

export default function PostLink({
  slug,
  children,
}: {
  slug: PostSlug;
  children: React.ReactNode;
}) {
  const setCurrentChannelSlug = useChatWindow((c) => c.setCurrentChannelSlug);

  return (
    <Link
      onClick={() => {
        const channelSlug = findChannelWithSlug(slug);
        if (channelSlug) {
          setCurrentChannelSlug(channelSlug);
        }
      }}
      href={`/${slug}`}
    >
      {children}
    </Link>
  );
}
