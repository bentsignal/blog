"use client";

import { useCallback, useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  image: string | null | undefined;
  name: string | undefined;
  myProfileId: Id<"profiles"> | undefined;
  signedIn: boolean;
  inProgress: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const useAuth = <T,>(selector: ContextSelector<AuthContextType, T>) =>
  useContextSelector(AuthContext, selector);

export const Provider = ({
  isAuthenticatedServerSide,
  children,
}: {
  isAuthenticatedServerSide: boolean;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  // either a sign in or sign out is in progress
  const [inProgress, setInProgress] = useState(false);

  const { isAuthenticated: isAuthenticatedClientSide } = useConvexAuth();

  const info = useQuery(
    api.user.getInfo,
    isAuthenticatedClientSide ? {} : "skip",
  );
  const image = useMemo(() => info?.image, [info]);
  const name = useMemo(() => info?.name, [info]);
  const myProfileId = useMemo(() => info?.profileId, [info]);

  const signOut = useCallback(async () => {
    if (inProgress) return;
    await authClient.signOut(
      {},
      {
        onResponse: () => {
          router.refresh();
        },
      },
    );
  }, [router, inProgress]);

  const deleteAccount = useCallback(async () => {
    await authClient.deleteUser(
      {},
      {
        onResponse: () => {
          router.refresh();
        },
      },
    );
  }, [router]);

  const signIn = useCallback(async () => {
    if (inProgress) return;
    try {
      setInProgress(true);
      await authClient.signIn.social(
        { provider: "github" },
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
    } catch (error) {
      console.error(error);
      setInProgress(false);
    }
  }, [inProgress]);

  const contextValue = useMemo(
    () => ({
      image,
      signedIn: isAuthenticatedServerSide,
      myProfileId,
      name,
      inProgress,
      signOut,
      signIn,
      deleteAccount,
    }),
    [
      isAuthenticatedServerSide,
      inProgress,
      signOut,
      signIn,
      deleteAccount,
      image,
      name,
      myProfileId,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
