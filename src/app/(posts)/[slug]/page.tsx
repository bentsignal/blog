import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/utils/style-utils";
import { fetchQuery } from "convex/nextjs";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/ui/atoms/button";

export default async function Page({
  params,
}: {
  params: Promise<Doc<"posts">>;
}) {
  const { slug, title } = await params;
  const { default: Post } = await import(`@/posts/${slug}.mdx`);

  return (
    <div className="mx-auto my-16 flex max-w-xl flex-col px-4">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <Link href="/">
        <Button variant="ghost">
          <MoveLeft /> Back to Home
        </Button>
      </Link>
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
  params: Promise<Doc<"posts">>;
}): Promise<Metadata> {
  const { title, subtitle } = await params;
  return {
    title,
    description: subtitle,
  };
}

export async function generateStaticParams(): Promise<Doc<"posts">[]> {
  return await fetchQuery(api.posts.getAll, {});
}

export const dynamicParams = false;
