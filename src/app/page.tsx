import Link from "next/link";
import { SelectorComposer, StandardComposer } from "@/components/composers";
import { RepoButton } from "@/components/repo-button";
import * as Card from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Link
        href="https://github.com/bentsignal/composition-is-all-you-need"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RepoButton />
      </Link>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              This version uses the bare context api, which leads to unnecessary
              re-renders.
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
