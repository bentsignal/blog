import { MainComposer } from "@/components/composers";
import * as Card from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center py-4">
      <Card.Card className="h-[700px] max-h-full rounded-3xl p-2">
        <Card.CardContent className="flex h-full flex-col p-2">
          <div className="align-start flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-y-auto mask-b-from-80% pb-8">
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
  );
}
