"use client";

import { MainComposer } from "@/components/composers";
import { UserMessage } from "@/components/messages";
import * as Card from "@/components/ui/card";
import { useMessages } from "@/hooks/use-messages";

export default function Home() {
  const messages = useMessages((state) => state.messages);
  return (
    <div className="flex h-screen items-center justify-center py-4">
      <Card.Card className="h-[700px] max-h-full w-full max-w-md rounded-3xl p-2">
        <Card.CardContent className="flex h-full flex-col p-2">
          <div className="align-start flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-y-auto mask-b-from-80% pb-8">
            {messages.map((message) => (
              <UserMessage key={message.id} message={message} />
            ))}
          </div>
          <MainComposer />
        </Card.CardContent>
      </Card.Card>
    </div>
  );
}
