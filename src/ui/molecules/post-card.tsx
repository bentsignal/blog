"use client";

import { useChatWindow } from "@/context/chat-window-context";
import { Post, PostSlug } from "@/data/posts";
import { validateChannelSlug } from "@/utils/slug-utils";
import { useRouter } from "next/navigation";
import * as Card from "@/ui/atoms/card";

export default function PostCard({
  post,
  slug,
}: {
  post: Post;
  slug: PostSlug;
}) {
  const router = useRouter();
  const setCurrentChannelSlug = useChatWindow((c) => c.setCurrentChannelSlug);

  return (
    <Card.Frame
      className="cursor-pointer px-0 py-4 select-none"
      onClick={() => {
        router.push(`/${slug}`);
        const channelSlug = validateChannelSlug(slug);
        if (channelSlug) {
          setCurrentChannelSlug(channelSlug);
        }
      }}
    >
      <Card.Content className="flex flex-col gap-1">
        <Card.Title>{post.title}</Card.Title>
        <Card.Description>{post.subtitle}</Card.Description>
      </Card.Content>
    </Card.Frame>
  );
}
