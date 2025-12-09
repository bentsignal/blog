import { createAuth } from "@/convex/auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";

export const getServersideToken = () => {
  return getTokenNextjs(createAuth);
};
