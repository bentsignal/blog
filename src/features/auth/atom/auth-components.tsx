"use client";

import * as SocialIcons from "@/features/socials/icons";
import { LogIn, LogOut, UserRoundX } from "lucide-react";
import { Context as AuthContext, useContext as useAuth } from "./auth-context";
import { Button } from "@/atoms/button";
import { Spinner } from "@/atoms/spinner";
import * as Theme from "@/atoms/theme";
import { useRequiredContext } from "@/lib/context";

export const PrimaryButton = () => {
  useRequiredContext(AuthContext);
  const imSignedIn = useAuth((c) => c.imSignedIn);
  return imSignedIn ? <SignOutButton /> : <SignInButton />;
};

export const SignInButton = () => {
  useRequiredContext(AuthContext);
  const signIn = useAuth((c) => c.signIn);
  const inProgress = useAuth((c) => c.inProgress);
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
  useRequiredContext(AuthContext);
  const signOut = useAuth((c) => c.signOut);
  const inProgress = useAuth((c) => c.inProgress);
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
  useRequiredContext(AuthContext);
  const deleteAccount = useAuth((c) => c.deleteAccount);
  const imNotSignedIn = useAuth((c) => !c.imSignedIn);
  const inProgress = useAuth((c) => c.inProgress);

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
  useRequiredContext(AuthContext);
  useRequiredContext(Theme.Context);

  const inProgress = useAuth((c) => c.inProgress);
  const signIn = useAuth((c) => c.signIn);
  const theme = Theme.useContext((c) => c.theme);
  const color = theme === "dark" ? "black" : "white";

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
