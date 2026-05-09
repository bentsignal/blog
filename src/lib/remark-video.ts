import { visit } from "unist-util-visit";
import type { Html, Image, Root } from "mdast";

const VIDEO_EXT_RE = /\.(mp4|webm|mov)$/i;

export default function remarkVideo() {
  return (tree: Root) => {
    visit(tree, "image", (node: Image, index, parent) => {
      if (index === undefined || !parent) return;
      if (!VIDEO_EXT_RE.test(node.url)) return;

      const html: Html = {
        type: "html",
        value: `<video src="${node.url}" autoplay loop muted playsinline class="rounded-xl"></video>`,
      };

      parent.children[index] = html as (typeof parent.children)[number];
    });
  };
}
