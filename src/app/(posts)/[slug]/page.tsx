import { MoveLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { SocialsBar } from "@/features/socials/socials-bar";
import * as Abyss from "@/atoms/abyss";
import * as Scroll from "@/atoms/scroll";
import { Separator } from "@/atoms/separator";
import { pages } from "@/blog/pages";
import { posts, Slug, slugs } from "@/blog/posts";
import { cn } from "@/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: Slug }>;
}) {
  const { slug } = await params;

  const post = posts[slug];
  const Page = pages[slug];

  const dateString = post.datePosted.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const readingTimeString = `${post.readingTimeInMinutes} min read`;

  return (
    <Scroll.Store>
      <Scroll.Wrapper>
        <Scroll.ProgressBar />
        <Abyss.Top />
        <Scroll.Container fade="md">
          <Scroll.Content className="mx-auto flex max-w-xl flex-col gap-2 px-4 py-16">
            <Link
              href="/"
              prefetch={true}
              className="text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors duration-100"
            >
              <MoveLeft className="size-3" /> Back to Home
            </Link>
            <div className="my-4 flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">{post.title}</h1>
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
                "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs",
              )}
            >
              <Page />
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-foreground text-sm">
                @bentsignal on everything
              </span>
              <SocialsBar />
            </div>
          </Scroll.Content>
        </Scroll.Container>
        <div className="absolute right-0 bottom-0 z-6 flex flex-col gap-2 p-4">
          <Scroll.ScrollToTopButton />
          <Scroll.ScrollToBottomButton />
        </div>
        <Abyss.Bottom />
      </Scroll.Wrapper>
    </Scroll.Store>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: Slug }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
  };
}

export async function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
