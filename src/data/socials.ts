import { Mail } from "lucide-react";
import * as Icons from "@/atoms/icon";

type Company =
  | "github"
  | "instagram"
  | "x"
  | "linkedin"
  | "bluesky"
  | "email"
  | "discord";

type Metadata = {
  url: string;
  icon: React.ComponentType;
  className?: string;
};

export const socials = {
  github: {
    url: "https://github.com/bentsignal",
    icon: Icons.Github,
  },
  x: {
    url: "https://x.com/bentsignal",
    icon: Icons.X,
    className: "size-4.5",
  },
  instagram: {
    url: "https://www.instagram.com/bentsignal/",
    icon: Icons.Instagram,
  },
  bluesky: {
    url: "https://bsky.app/profile/bentsignal.com",
    icon: Icons.Bluesky,
  },
  discord: {
    url: "https://discord.gg/Ep9YsvhZ",
    icon: Icons.Discord,
    className: "size-6",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/bentsignal/",
    icon: Icons.LinkedIn,
  },
  email: {
    url: "mailto:me@bentsignal.com",
    icon: Mail,
    className: "size-6",
  },
} as const satisfies Record<Company, Metadata>;

export const companies = Object.keys(socials) as Company[];
