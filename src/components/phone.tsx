"use client";

import * as Auth from "@/components/auth";
import { useAuth } from "@/components/auth";
import { MainComposer } from "@/components/composers";
import { Messages } from "@/components/messages";
import * as Card from "@/components/ui/card";

export const Phone = () => {
  return (
    <Card.Card className="h-[700px] max-h-full w-full max-w-md rounded-3xl p-0">
      <Card.CardContent className="flex h-full flex-col p-2">
        <Header />
        <Messages />
        <MainComposer />
      </Card.CardContent>
    </Card.Card>
  );
};

const Header = () => {
  const signedIn = useAuth((c) => c.signedIn);
  return (
    <div className="bg-muted mx-2 mt-2 flex items-center justify-between rounded-2xl p-3">
      <div className="flex items-center gap-3 pl-1">
        <span className="font-semibol text-3xl">#</span>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold">General</span>
          <span className="text-muted-foreground text-xs">Text Channel</span>
        </div>
      </div>
      {signedIn ? <Auth.Profile /> : <Auth.SignIn />}
    </div>
  );
};
