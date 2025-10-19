"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/ui/atoms/button";
import { Icon } from "@/ui/atoms/icon";

export const RepoButton = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Link
      href="https://github.com/bentsignal/how-i-code"
      target="_blank"
      className="transition-opacity duration-300"
    >
      <Button variant="outline">
        Repo
        <Icon
          icon="siGithub"
          color={resolvedTheme === "light" ? "black" : "white"}
        />
      </Button>
    </Link>
  );
};
