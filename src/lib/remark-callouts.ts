import { visit } from "unist-util-visit";
import { isInternalUrl } from "./site";
import type { Blockquote, Html, Root, Text } from "mdast";

const CALLOUT_TYPES = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"];
const CALLOUT_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)]\s*/i;

function extractTextContent(node: Blockquote): string {
  const first = node.children[0];
  if (!first || first.type !== "paragraph") return "";
  const textNode = first.children[0];
  if (!textNode || textNode.type !== "text") return "";
  return (textNode as Text).value;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blockquoteChildrenToHtml(
  node: Blockquote,
  prefixToStrip: string,
): string {
  const parts: string[] = [];

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "paragraph") {
      const inlineParts: string[] = [];
      for (let j = 0; j < child.children.length; j++) {
        const inline = child.children[j];
        if (inline.type === "text") {
          let value = inline.value;
          if (i === 0 && j === 0) {
            value = value.replace(prefixToStrip, "");
          }
          inlineParts.push(escapeHtml(value));
        } else if (inline.type === "inlineCode") {
          inlineParts.push(`<code>${escapeHtml(inline.value)}</code>`);
        } else if (inline.type === "strong") {
          const text = inline.children
            .map((c) => ("value" in c ? c.value : ""))
            .join("");
          inlineParts.push(`<strong>${escapeHtml(text)}</strong>`);
        } else if (inline.type === "emphasis") {
          const text = inline.children
            .map((c) => ("value" in c ? c.value : ""))
            .join("");
          inlineParts.push(`<em>${escapeHtml(text)}</em>`);
        } else if (inline.type === "link") {
          const text = inline.children
            .map((c) => ("value" in c ? c.value : ""))
            .join("");
          const externalAttrs = isInternalUrl(inline.url)
            ? ""
            : ' target="_blank" rel="noopener noreferrer"';
          inlineParts.push(
            `<a href="${escapeHtml(inline.url)}"${externalAttrs}>${escapeHtml(text)}</a>`,
          );
        }
      }
      const content = inlineParts.join("").trim();
      if (content) {
        parts.push(`<p>${content}</p>`);
      }
    }
  }

  return parts.join("\n");
}

export default function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      if (index === undefined || !parent) return;

      const text = extractTextContent(node);
      const match = CALLOUT_RE.exec(text);
      if (!match) return;

      const type = match[1].toUpperCase();
      if (!CALLOUT_TYPES.includes(type)) return;

      const label = type.charAt(0) + type.slice(1).toLowerCase();
      const typeLower = type.toLowerCase();
      const content = blockquoteChildrenToHtml(node, match[0]);

      const html: Html = {
        type: "html",
        value: [
          `<div class="callout callout-${typeLower}">`,
          `  <div class="callout-header">`,
          `    <span class="callout-label">${label}</span>`,
          `  </div>`,
          `  <div class="callout-content">`,
          `    ${content}`,
          `  </div>`,
          `</div>`,
        ].join("\n"),
      };

      parent.children[index] = html as (typeof parent.children)[number];
    });
  };
}
