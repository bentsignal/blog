"use client";

import * as SocialIcons from "@/features/socials";
import { LogIn, LogOut, UserRoundX } from "lucide-react";
import { useTheme } from "next-themes";
import { Context as AuthContext, use as useAuth } from "./auth-context";
import { Button } from "@/atoms/button";
import { Spinner } from "@/atoms/spinner";
import { useRequiredContext } from "@/lib/context";

const PrimaryButton = () => {
  useRequiredContext(AuthContext);
  const imSignedIn = useAuth((c) => c.imSignedIn);
  return imSignedIn ? <SignOutButton /> : <SignInButton />;
};

const SignInButton = () => {
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

const SignOutButton = () => {
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

const DeleteAccountButton = () => {
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

const JoinButton = () => {
  useRequiredContext(AuthContext);
  const inProgress = useAuth((c) => c.inProgress);
  const signIn = useAuth((c) => c.signIn);

  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "light" ? "white" : "black";

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

export {
  PrimaryButton,
  SignInButton,
  SignOutButton,
  DeleteAccountButton,
  JoinButton,
};
