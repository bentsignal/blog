"use client";

import { LogIn, LogOut, UserRoundX } from "lucide-react";
import { useStore as useAuthStore } from "./auth-store";
import * as SocialIcons from "@/features/socials/icons";
import * as Theme from "@/features/theme/atom";
import { Button } from "@/atoms/button";
import { Spinner } from "@/atoms/spinner";

export const PrimaryButton = () => {
  const imSignedIn = useAuthStore((s) => s.imSignedIn);
  return imSignedIn ? <SignOutButton /> : <SignInButton />;
};

export const SignInButton = () => {
  const signIn = useAuthStore((s) => s.signIn);
  const inProgress = useAuthStore((s) => s.inProgress);
  return (
    <Button
      variant="link"
      onClick={signIn}
      className="focus-visible:ring-0"
      disabled={inProgress}
    >
      {inProgress ? <Spinner /> : <LogIn className="size-4" />}
      Sign In
    </Button>
  );
};

export const SignOutButton = () => {
  const signOut = useAuthStore((s) => s.signOut);
  const inProgress = useAuthStore((s) => s.inProgress);
  return (
    <Button
      variant="link"
      onClick={signOut}
      className="focus-visible:ring-0"
      disabled={inProgress}
    >
      {inProgress ? <Spinner /> : <LogOut className="size-4" />}
      Sign Out
    </Button>
  );
};

export const DeleteAccountButton = () => {
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const imNotSignedIn = useAuthStore((s) => !s.imSignedIn);
  const inProgress = useAuthStore((s) => s.inProgress);

  if (imNotSignedIn) return null;

  return (
    <Button
      variant="link"
      onClick={deleteAccount}
      disabled={inProgress}
      className="focus-visible:ring-0"
    >
      <UserRoundX className="size-4" />
      Delete Account
    </Button>
  );
};

export const JoinButton = () => {
  const inProgress = useAuthStore((s) => s.inProgress);
  const signIn = useAuthStore((s) => s.signIn);
  const inDarkMode = Theme.useStore((s) => s.theme.mode === "dark");
  const color = inDarkMode ? "black" : "white";

  return (
    <Button className="min-w-52 font-bold" onClick={signIn}>
      {inProgress ? (
        <Spinner />
      ) : (
        <div className="flex items-center gap-2">
          Join the conversation
          <SocialIcons.Github color={color} />
        </div>
      )}
    </Button>
  );
};
