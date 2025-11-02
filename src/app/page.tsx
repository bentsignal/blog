"use cache";

import { posts, postSlugs } from "@/data/posts";
import PostCard from "@/ui/molecules/post-card";

export default async function HomePage() {
  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col items-center justify-center gap-4">
      {postSlugs.map((slug) => {
        const post = posts[slug];
        return <PostCard post={post} slug={slug} key={slug} />;
      })}
    </div>
  );
}
