import { posts, postSlugs, type PostSlug } from "@/data/posts";
import { validatePostSlug } from "@/utils/slug-utils";
import { cn } from "@/utils/style-utils";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const validatedSlug = validatePostSlug(slug);

  if (!validatedSlug) {
    notFound();
  }

  const post = posts[validatedSlug];

  const { default: Post } = await import(`@/posts/${validatedSlug}.mdx`);

  return (
    <div className="mx-auto my-16 flex max-w-xl flex-col gap-2 px-4">
      <Link
        href="/"
        className="text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors duration-100"
      >
        <MoveLeft className="size-3" /> Back to Home
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
