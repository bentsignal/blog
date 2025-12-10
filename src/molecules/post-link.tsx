"use client";

import { PostSlug } from "@/data/posts";
import * as Chat from "@/features/chat/atom";
import { findChannelWithSlug } from "@/utils/slug-utils";
import Link from "next/link";
import { useRequiredContext } from "@/lib/context";

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
      href={`/${slug}`}
    >
      {children}
    </Link>
  );
}
