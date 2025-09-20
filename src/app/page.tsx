"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { SelectorComposer, StandardComposer } from "@/components/composers";
import { SimpleIcons } from "@/components/simple-icons";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Link
        href="https://github.com/bentsignal/composition-is-all-you-need"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline">
          Code
          <SimpleIcons
            icon="siGithub"
            color={theme === "dark" ? "white" : "black"}
          />
        </Button>
      </Link>
      <div className="flex items-center justify-center gap-4">
        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle className="text-good">
              With context selector
            </Card.CardTitle>
            <Card.CardDescription>
              This version uses{" "}
              <Link
                className="text-link"
                href="https://www.npmjs.com/package/@fluentui/react-context-selector"
                target="_blank"
                rel="noopener noreferrer"
              >
                react-context-selector
              </Link>{" "}
              to avoid unnecessary re-renders.
            </Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent>
            <SelectorComposer />
          </Card.CardContent>
        </Card.Card>
        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle className="text-bad">
              Without context selector
            </Card.CardTitle>
            <Card.CardDescription>
              This version uses the built in react context api, which leads to
              unnecessary re-renders.
            </Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent>
            <StandardComposer />
          </Card.CardContent>
        </Card.Card>
      </div>
    </div>
  );
}
