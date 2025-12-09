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

export type { Company, Metadata };
