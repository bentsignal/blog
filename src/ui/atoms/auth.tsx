"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRound } from "lucide-react";
import { Button } from "../external/button";
import * as Popover from "../external/popover";
import { Spinner } from "./spinner";

export const ProfileButton = () => {
  const [open, setOpen] = useState(false);

  const signOut = useAuth((c) => c.signOut);
  // const deleteAccount = useAuth((c) => c.deleteAccount);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="flex items-center pr-1 pl-3"
    >
      <Popover.Popover open={open} onOpenChange={setOpen}>
        <Popover.PopoverTrigger className="py-1 outline-none!">
          <div className="bg-muted-foreground/10 flex size-7 items-center justify-center rounded-full">
            <UserRound className="text-muted-foreground size-3.5" />
          </div>
        </Popover.PopoverTrigger>
        <Popover.PopoverContent className="-mt-1 flex w-auto flex-col p-1">
          <Button
            variant="link"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="focus-visible:ring-0"
          >
            Sign Out
          </Button>
          {/* <Button
            variant="link"
            onClick={async () => {
              setOpen(false);
              await deleteAccount();
            }}
          >
            Delete Account
          </Button> */}
        </Popover.PopoverContent>
      </Popover.Popover>
    </div>
  );
};

export const SignInButton = () => {
  const inProgress = useAuth((c) => c.inProgress);
  const signIn = useAuth((c) => c.signIn);
  return (
    <Button className="min-w-46 font-bold" onClick={signIn}>
      {inProgress ? <Spinner /> : "Join the conversation"}
    </Button>
  );
};
