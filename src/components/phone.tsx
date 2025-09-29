"use client";

import * as Auth from "@/components/auth";
import { MainComposer } from "@/components/composers";
import { Messages } from "@/components/messages";
import * as Card from "@/components/ui/card";

export const Phone = ({ authed }: { authed: boolean }) => {
  return (
    <Card.Card className="h-[700px] max-h-full w-full max-w-md rounded-3xl p-0">
      <Card.CardContent className="flex h-full flex-col p-2">
        <div className="bg-muted mx-2 mt-2 flex items-center justify-between rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <span className="font-semibol pl-1 text-3xl">#</span>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold">General</span>
              <span className="text-muted-foreground text-xs">
                Text Channel
              </span>
            </div>
          </div>
          {authed ? <Auth.Profile /> : <Auth.SignIn />}
        </div>
        <div className="align-start flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-y-auto overscroll-contain mask-t-from-97% mask-b-from-97% p-4">
          <Messages />
        </div>
        <div className="px-2 pb-2">
          <MainComposer />
        </div>
      </Card.CardContent>
    </Card.Card>
  );
};
