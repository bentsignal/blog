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

const atmosphereHeight = 265;

const background = [
  "linear-gradient(to top, #05133d 0%, #01010e 30%, #000000 43%)",
  "linear-gradient(to bottom, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0))",
].join(",");

const atmosphereGlow =
  "radial-gradient(125% 82% at 50% 100%, rgba(125, 190, 255, 0.18) 0%, rgba(24, 102, 178, 0.12) 38%, rgba(1, 9, 28, 0) 78%)";

const atmosphereHaze =
  "radial-gradient(120% 82% at 50% 100%, rgba(46, 122, 214, 0.22) 0%, rgba(13, 64, 123, 0.16) 48%, rgba(1, 3, 16, 0) 82%)";

const atmosphere =
  "radial-gradient(170% 82% at 50% 100%, #b9def5 0%, #4aa3e2 10%, #1771c4 30%, #104f8e 48%, #08223f 68%, rgba(1, 3, 16, 0) 100%)";

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
          background,
          position: "relative",
          overflow: "hidden",
        }}
        tw="flex flex-col justify-center w-full h-full p-12"
      >
        <div
          style={{
            background: atmosphereGlow,
            bottom: 0,
            height: atmosphereHeight,
            left: 0,
            position: "absolute",
            width: size.width,
          }}
        />
        <div
          style={{
            background: atmosphereHaze,
            bottom: 0,
            height: atmosphereHeight,
            left: 0,
            position: "absolute",
            width: size.width,
          }}
        />
        <div
          style={{
            background: atmosphere,
            bottom: 0,
            height: atmosphereHeight,
            left: 0,
            position: "absolute",
            width: size.width,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <h1
            style={{ fontSize: 48, fontFamily: "Inter" }}
            tw="font-bold text-white"
          >
            {post.title}
          </h1>
          <span
            style={{ fontSize: 28, fontFamily: "Inter" }}
            tw="text-gray-300"
          >
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
