import React from "react";
import {
  Info,
  Lightbulb,
  MessageSquareWarning,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/style-utils";

const calloutTypes = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const;
type CalloutType = (typeof calloutTypes)[number];

const calloutConfig: Record<CalloutType, { icon: LucideIcon; label: string }> =
  {
    note: { icon: Info, label: "Note" },
    tip: { icon: Lightbulb, label: "Tip" },
    important: { icon: MessageSquareWarning, label: "Important" },
    warning: { icon: TriangleAlert, label: "Warning" },
    caution: { icon: OctagonAlert, label: "Caution" },
  };

const accentGradientColors: Record<CalloutType, string> = {
  note: "rgb(147 197 253 / 0.4)",
  tip: "rgb(110 231 183 / 0.4)",
  important: "rgb(216 180 254 / 0.4)",
  warning: "rgb(252 211 77 / 0.4)",
  caution: "rgb(252 165 165 / 0.4)",
};

const labelColors: Record<CalloutType, string> = {
  note: "text-blue-600/80 dark:text-blue-300/80",
  tip: "text-emerald-600/80 dark:text-emerald-300/80",
  important: "text-purple-600/80 dark:text-purple-300/80",
  warning: "text-amber-600/80 dark:text-amber-300/80",
  caution: "text-red-600/80 dark:text-red-300/80",
};

function Callout({
  type,
  className,
  children,
}: {
  type: CalloutType;
  className?: string;
  children: React.ReactNode;
}) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  const accent = accentGradientColors[type];

  return (
    <div className={cn("not-prose relative my-8 w-full", className)}>
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={
          {
            padding: "1px",
            background: `conic-gradient(from 90deg, var(--border) 0deg, var(--border) 160deg, ${accent} 180deg, var(--border) 200deg, var(--border) 360deg)`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
          } as React.CSSProperties
        }
      />
      <div className="bg-card/50 relative overflow-hidden rounded-xl px-5 py-4 backdrop-blur-2xl">
        <div
          className={cn(
            "mb-2 flex items-center gap-2 text-sm font-medium",
            labelColors[type],
          )}
        >
          <Icon className="size-3.5" />
          <span>{config.label}</span>
        </div>
        <div
          className={cn(
            "text-muted-foreground text-sm leading-relaxed",
            "[&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Utilities for parsing GitHub-style callout syntax from blockquotes ──

const CALLOUT_PATTERN = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

/**
 * Inspects a blockquote's children for the `[!TYPE]` pattern.
 * Returns the callout type and cleaned content, or null if not a callout.
 */
function extractCalloutInfo(children: React.ReactNode): {
  type: CalloutType;
  content: React.ReactNode;
} | null {
  const childArray = React.Children.toArray(children);
  if (childArray.length === 0) return null;

  // Find the first <p> element (skip whitespace text nodes)
  const pIndex = childArray.findIndex(
    (child) => React.isValidElement(child) && child.type === "p",
  );
  if (pIndex === -1) return null;

  const firstP = childArray[pIndex] as React.ReactElement;

  const pChildren = React.Children.toArray(
    (firstP.props as { children?: React.ReactNode }).children,
  );
  if (pChildren.length === 0) return null;

  const firstText = pChildren[0];
  if (typeof firstText !== "string") return null;

  const match = firstText.match(CALLOUT_PATTERN);
  if (!match) return null;

  const type = match[1].toLowerCase() as CalloutType;
  const remainingText = firstText.slice(match[0].length);

  // Reconstruct the <p> element without the [!TYPE] prefix
  const newPChildren = [
    remainingText.length > 0 ? remainingText : null,
    ...pChildren.slice(1),
  ].filter((child) => child !== null);

  const newChildren: React.ReactNode[] = [];

  // Only include the first <p> if it still has content after stripping
  if (newPChildren.length > 0) {
    newChildren.push(
      React.cloneElement(firstP, { key: "callout-first-p" }, ...newPChildren),
    );
  }

  // Include any remaining children after the first <p> (additional paragraphs, etc.)
  // Skip whitespace-only text nodes
  for (let i = pIndex + 1; i < childArray.length; i++) {
    const child = childArray[i];
    if (typeof child === "string" && child.trim() === "") continue;
    newChildren.push(child);
  }

  return { type, content: newChildren };
}

export { Callout, extractCalloutInfo, calloutTypes };
export type { CalloutType };
