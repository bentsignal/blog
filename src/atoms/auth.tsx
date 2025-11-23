"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexAuth, useQuery } from "convex/react";
import { LogIn, LogOut, UserRoundX } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./button";
import * as Icons from "./icon";
import { Spinner } from "./spinner";
import { authClient } from "@/lib/auth-client";
import { createContext } from "@/lib/context";

export const { Context: AuthContext, useContext: useAuth } = createContext<{
  image: string | null | undefined;
  name: string | undefined;
  username: string | undefined;
  myProfileId: Id<"profiles"> | undefined;
  imSignedIn: boolean;
  inProgress: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}>({ displayName: "AuthContext" });

export const Provider = ({
  isAuthenticatedServerSide,
  children,
}: {
  isAuthenticatedServerSide: boolean;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  // either a sign in or sign out is in progress
  const [inProgress, setInProgress] = useState(false);

  // use serverside auth value until client is mounted
  const { isAuthenticated: isAuthenticatedClientSide } = useConvexAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 5000);
  }, []);

  const imSignedIn = mounted
    ? isAuthenticatedClientSide
    : isAuthenticatedServerSide;

  const info = useQuery(
    api.user.getInfo,
    isAuthenticatedClientSide ? {} : "skip",
  );

  const image = useMemo(() => info?.image, [info]);
  const name = useMemo(() => info?.name, [info]);
  const username = useMemo(() => info?.username, [info]);
  const myProfileId = useMemo(() => info?.profileId, [info]);

  const signOut = useCallback(async () => {
    if (inProgress) return;
    setInProgress(true);
    await authClient.signOut(
      {},
      {
        onResponse: () => {
          setInProgress(false);
        },
      },
    );
  }, [inProgress]);

  const deleteAccount = useCallback(async () => {
    await authClient.deleteUser(
      {},
      {
        onResponse: () => {
          setInProgress(false);
        },
      },
    );
  }, []);

  const signIn = useCallback(async () => {
    if (inProgress) return;
    setInProgress(true);
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: pathname || "/",
      },
      {
        onError: (error) => {
          setInProgress(false);
          console.error(error);
          toast.error(
            "Ran into an error trying to sign in, see console for more details.",
          );
        },
      },
    );
  }, [inProgress, pathname]);

  const contextValue = useMemo(
    () => ({
      image,
      username,
      imSignedIn,
      myProfileId,
      name,
      inProgress,
      signOut,
      signIn,
      deleteAccount,
    }),
    [
      imSignedIn,
      inProgress,
      signOut,
      signIn,
      deleteAccount,
      image,
      name,
      username,
      myProfileId,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const PrimaryButton = () => {
  const imSignedIn = useAuth((c) => c.imSignedIn);
  return imSignedIn ? <SignOutButton /> : <SignInButton />;
};

export const SignInButton = () => {
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
          <Icons.Github color={color} />
        </div>
      )}
    </Button>
  );
};
