import { visit } from "unist-util-visit";
import { isInternalUrl } from "./site";

export default function rehypeExternalLinks() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, "element", (node: Record<string, unknown>) => {
      if (node.tagName !== "a") return;
      const props = node.properties as Record<string, unknown> | undefined;
      const href = props?.href;
      if (typeof href !== "string") return;
      if (isInternalUrl(href)) return;

      const p = (node.properties ??= {}) as Record<string, unknown>;
      p.target = "_blank";
      p.rel = "noopener noreferrer";
    });
  };
}
