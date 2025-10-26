import { api } from "@/convex/_generated/api";
import { cn } from "@/utils/style-utils";
import { fetchQuery } from "convex/nextjs";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/ui/atoms/button";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const post = await fetchQuery(api.posts.getBySlug, { slug });
  if (!post) {
    notFound();
  }

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
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchQuery(api.posts.getBySlug, { slug: params.slug });

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.subtitle,
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await fetchQuery(api.posts.getAll, {});
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
