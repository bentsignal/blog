"use client";

import { useTheme } from "next-themes";
import { SimpleIcons } from "../atoms/icons";
import { Button } from "../external/button";

export const RepoButton = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="transition-opacity duration-300">
      <Button variant="outline">
        Code
        <SimpleIcons
          icon="siGithub"
          color={resolvedTheme === "light" ? "black" : "white"}
        />
      </Button>
    </div>
  );
};
