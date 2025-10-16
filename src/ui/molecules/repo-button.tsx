"use client";

import { useTheme } from "next-themes";
import { Button } from "@/ui/atoms/button";
import { SimpleIcons } from "@/ui/atoms/icons";

export const RepoButton = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="transition-opacity duration-300">
      <Button variant="outline">
        Repo
        <SimpleIcons
          icon="siGithub"
          color={resolvedTheme === "light" ? "black" : "white"}
        />
      </Button>
    </div>
  );
};
