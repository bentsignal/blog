import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { createAuth } from "@/convex/auth";

export const getServersideToken = () => {
  return getTokenNextjs(createAuth);
};
