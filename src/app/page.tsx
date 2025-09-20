import Link from "next/link";
import { SelectorComposer, StandardComposer } from "@/components/composers";
import * as Card from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4">
        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle className="text-green-300">
              With context selector
            </Card.CardTitle>
            <Card.CardDescription>
              This version uses{" "}
              <Link
                className="text-blue-300"
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
            <Card.CardTitle className="text-red-300">
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
