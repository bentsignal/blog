import { Resvg } from "@resvg/resvg-js";
import { getCollection } from "astro:content";
import satori from "satori";
import type { APIRoute, GetStaticPaths } from "astro";
import { OgImage } from "@/lib/og-template";

const WIDTH = 1200;
const HEIGHT = 630;

async function loadGoogleFont(
  font: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const data = await fetch(url);
  const css = await data.text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error(`Failed to load font: ${font} ${weight}`);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts
    .filter((post) => !post.data.hide || import.meta.env.DEV)
    .map((post) => ({
      params: { slug: post.id.replace(/\/index$/, "") },
      props: { post },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;

  const allText = `${post.data.title} ${post.data.description} blog.bentsignal.com`;

  const [interRegular, interSemiBold] = await Promise.all([
    loadGoogleFont("Inter", 400, allText),
    loadGoogleFont("Inter", 700, allText),
  ]);

  const element = OgImage({
    title: post.data.title,
    description: post.data.description,
  });

  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
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
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });

  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
