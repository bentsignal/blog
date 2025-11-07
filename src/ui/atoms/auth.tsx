"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import * as Icons from "./icon";
import * as Popover from "./popover";
import { Spinner } from "./spinner";

export const ProfileButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="flex items-center pr-1 pl-3"
    >
      <Popover.Frame open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="py-1 outline-none!">
          <div className="bg-muted-foreground/10 flex size-7 items-center justify-center rounded-full">
            <UserRound className="text-muted-foreground size-3.5" />
          </div>
        </Popover.Trigger>
        <Popover.Content className="-mt-1 flex w-auto flex-col p-1">
          <SignOutButton closePopover={() => setOpen(false)} />
        </Popover.Content>
      </Popover.Frame>
    </div>
  );
};

export const SignOutButton = ({
  closePopover,
}: {
  closePopover: () => void;
}) => {
  const signOut = useAuth((c) => c.signOut);
  return (
    <Button
      variant="link"
      onClick={async () => {
        closePopover();
        await signOut();
      }}
      className="focus-visible:ring-0"
    >
      Sign Out
    </Button>
  );
};

export const DeleteAccountButton = ({
  closePopover,
}: {
  closePopover: () => void;
}) => {
  const deleteAccount = useAuth((c) => c.deleteAccount);
  return (
    <Button
      variant="link"
      onClick={async () => {
        closePopover();
        await deleteAccount();
      }}
    >
      Delete Account
    </Button>
  );
};

export const SignInButton = () => {
  const inProgress = useAuth((c) => c.inProgress);
  const signIn = useAuth((c) => c.signIn);

  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "light" ? "white" : "black";
  console.log(color);

  return (
    <Button className="min-w-52 font-bold" onClick={signIn}>
      {inProgress ? (
        <Spinner />
      ) : (
        <div className="flex items-center gap-2">
          Join the conversation
          <Icons.Github color={color} />
        </div>
      )}
    </Button>
  );
};

export const PrimaryButton = () => {
  const isSignedIn = useAuth((c) => c.signedIn);
  return isSignedIn ? <ProfileButton /> : <SignInButton />;
};
