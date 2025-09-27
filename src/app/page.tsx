"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { MainComposer } from "@/components/composers";
import { UserMessage } from "@/components/messages";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { useMessages } from "@/hooks/use-messages";

export default function Home() {
  const messages = useMessages((state) => state.messages);
  return (
    <div className="flex h-screen items-center justify-center py-4">
      <Card.Card className="h-[700px] max-h-full w-full max-w-md rounded-3xl p-0">
        <Card.CardContent className="flex h-full flex-col p-2">
          <div className="align-start flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-y-auto mask-t-from-97% mask-b-from-90% p-4 pb-12">
            {messages.map((message) => (
              <UserMessage key={message.id} message={message} />
            ))}
          </div>
          <div className="px-2 pb-2">
            <MainComposer />
          </div>
        </Card.CardContent>
      </Card.Card>
      <div className="absolute top-4 left-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
