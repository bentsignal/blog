"use client";

import Link from "next/link";
import type { PostSlug } from "@/blog/posts";
import { useRequiredContext } from "@/lib/context";
import { findChannelWithSlug } from "@/utils/slug-utils";
import * as Chat from "@/features/chat/atom";

export default function PostLink({
  slug,
  children,
}: {
  slug: PostSlug;
  children: React.ReactNode;
}) {
  useRequiredContext(Chat.Context);

  const setCurrentChannelSlug = Chat.useContext((c) => c.setCurrentChannelSlug);

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
