import type { Slug } from "@/blog/slugs";

export interface Channel {
  name: string;
}

export const channels = {
  general: {
    name: "General",
  },
  "organizing-react-projects": {
    name: "Organizing React Projects",
  },
} as const satisfies Partial<Record<Slug, Channel>>;

export type ChannelSlug = keyof typeof channels;

export const channelSlugs = Object.keys(channels) as ChannelSlug[];
