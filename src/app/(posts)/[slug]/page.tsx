import { Provider as ListProvider } from "@/context/list-context";
import { posts, postSlugs, type PostSlug } from "@/data/posts";
import { validatePostSlug } from "@/utils/slug-utils";
import { cn } from "@/utils/style-utils";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as Abyss from "@/ui/atoms/abyss";
import * as List from "@/ui/atoms/list";
import { TopControls } from "@/ui/molecules/top-controls";

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

  const dateString = post.datePosted.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const readingTimeString = `${post.readingTimeInMinutes} min read`;

  return (
    <ListProvider>
      <List.Frame>
        <List.ProgressBar />
        <TopControls className="absolute top-0 left-0 z-6" />
        <Abyss.Top />
        <List.Body fade="md">
          <div className="mx-auto flex max-w-xl flex-col gap-2 px-4 py-16">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors duration-100"
            >
              <MoveLeft className="size-3" /> Back to Home
            </Link>
            <div className="my-4 flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {dateString} • {readingTimeString}
                </p>
              </div>
            </div>
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
        </List.Body>
        <div className="absolute right-0 bottom-0 z-6 flex flex-col gap-2 p-4">
          <List.ScrollToTopButton />
          <List.ScrollToBottomButton />
        </div>
        <Abyss.Bottom />
      </List.Frame>
    </ListProvider>
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
