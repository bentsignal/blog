"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { createStore } from "rostra";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type StoreProps = {
  isAuthenticatedServerSide: boolean;
};

type StoreType = {
  image: string | null | undefined;
  name: string | undefined;
  username: string | undefined;
  myProfileId: Id<"profiles"> | undefined;
  imSignedIn: boolean;
  inProgress: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

function useInternalStore({ isAuthenticatedServerSide }: StoreProps) {
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

  return {
    image,
    username,
    imSignedIn,
    myProfileId,
    name,
    inProgress,
    signOut,
    signIn,
    deleteAccount,
  };
}

export const { Store, useStore } = createStore<StoreType, StoreProps>(
  useInternalStore,
);
