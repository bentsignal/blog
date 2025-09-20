"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SimpleIcons } from "./simple-icons";
import { Button } from "./ui/button";

export const RepoButton = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div
      className="transition-opacity duration-300"
      style={{
        opacity: mounted ? 1 : 0,
      }}
    >
      <Button variant="outline">
        Code
        {mounted && (
          <SimpleIcons
            icon="siGithub"
            color={resolvedTheme === "dark" ? "white" : "black"}
          />
        )}
      </Button>
    </div>
  );
};
