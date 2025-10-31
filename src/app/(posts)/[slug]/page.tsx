import { posts, postSlugs, type PostSlug } from "@/data/posts";
import { cn } from "@/utils/style-utils";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/ui/atoms/button";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: PostSlug }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  const { default: Post } = await import(`@/posts/${slug}.mdx`);

  return (
    <div className="mx-auto my-16 flex max-w-xl flex-col gap-2 px-4">
      <Link href="/">
        <Button variant="ghost">
          <MoveLeft /> Back to Home
        </Button>
      </Link>
      <h2 className="text-3xl font-semibold">{post.title}</h2>
      <p className="text-muted-foreground">{post.subtitle}</p>
      <div
        className={cn(
          "prose dark:prose-invert",
          "prose-headings:mt-8 prose-headings:font-semibold",
          "prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg",
        )}
      >
        <Post />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: PostSlug }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];

  return {
    title: post.title,
    description: post.subtitle,
  };
}

export async function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
