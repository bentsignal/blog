import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { PostSlug } from "@/blog/posts";
import { posts } from "@/blog/posts";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: PostSlug }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  const interSemiBold = await readFile(
    join(process.cwd(), "src/assets/Inter_18pt-SemiBold.ttf"),
  );

  return new ImageResponse(
    (
      <div tw="bg-black-900 flex flex-col items-center justify-center">
        <h1 tw="text-4xl font-bold text-white">{post.title}</h1>
        <p tw="text-lg text-gray-300">{post.description}</p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
