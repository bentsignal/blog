import { ImageResponse } from "next/og";
import type { PostSlug } from "@/blog/posts";
import { loadAvatar, loadGoogleFont } from "@/utils/og-utils";
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

  const allText = `${post.title} ${post.description} blog.bentsignal.com`;

  const [interRegular, interSemiBold, avatar] = await Promise.all([
    loadGoogleFont("Inter", 400, allText),
    loadGoogleFont("Inter", 700, allText),
    loadAvatar(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom, #000000, #121212)",
        }}
        tw="flex flex-col justify-center w-full h-full p-12"
      >
        <h1
          style={{ fontSize: 48, fontFamily: "Inter" }}
          tw="font-bold text-white"
        >
          {post.title}
        </h1>
        <span style={{ fontSize: 28, fontFamily: "Inter" }} tw="text-gray-300">
          {post.description}
        </span>
        <div tw="flex items-center mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt="Avatar"
            tw="w-16 h-16 rounded-full"
            height={64}
            width={64}
          />
          <span
            style={{ fontSize: 24, fontFamily: "Inter" }}
            tw="text-white ml-4 font-semibold"
          >
            blog.bentsignal.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
