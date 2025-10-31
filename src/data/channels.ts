import type { Slug } from "@/types/slugs";

export interface Channel {
  name: string;
}

export const channels = {
  general: {
    name: "General",
  },
  "atomic-composition": {
    name: "Atomic Composition",
  },
  "build-strong-foundations": {
    name: "Build Strong Foundations",
  },
} as const satisfies Partial<Record<Slug, Channel>>;

export type ChannelSlug = keyof typeof channels;
