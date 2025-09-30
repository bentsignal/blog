import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";
import {
  ActionCtx,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { authComponent } from "./auth";

export const checkAuth = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  return user;
};

export const authedMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await checkAuth(ctx);
    return { user };
  }),
);

export const authedQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await checkAuth(ctx);
    return { user };
  }),
);
