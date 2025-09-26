import Link from "next/link";
import { MainComposer } from "@/components/composers";
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
        <Card.Card className="rounded-3xl p-2">
          <Card.CardContent className="p-2">
            <div className="align-start flex max-h-[500px] flex-col justify-start gap-2 overflow-y-auto bg-blue-500">
              {Array.from({ length: 100 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-muted size-10 min-h-10 rounded-md"
                />
              ))}
            </div>
            <MainComposer />
          </Card.CardContent>
        </Card.Card>
      </div>
    </div>
  );
}
