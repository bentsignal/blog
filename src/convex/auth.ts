import {
  AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { deleteAllFromUser } from "./messages";
import { getProfile } from "./user";

const authFunctions: AuthFunctions = internal.auth;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onDelete: async (ctx, authUser) => {
        await deleteAllFromUser(ctx, authUser._id);
        const profile = await getProfile(ctx, authUser._id);
        if (profile) {
          await ctx.db.delete(profile._id);
        }
      },
      onCreate: async (ctx, authUser) => {
        const profile = await ctx.db.insert("profiles", {
          user: authUser._id,
          name: authUser.name,
        });
        if (authUser.image) {
          ctx.scheduler.runAfter(0, internal.uploadthing.uploadPFP, {
            profileId: profile,
            url: authUser.image || "",
          });
        }
      },
      onUpdate: async (ctx, authUser) => {
        const profile = await getProfile(ctx, authUser._id);
        if (!profile) return;
        await ctx.db.patch(profile._id, {
          name: authUser.name,
        });
      },
    },
  },
});

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: false,
      requireEmailVerification: false,
    },
    user: {
      deleteUser: {
        enabled: false,
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    plugins: [convex()],
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },
  });
};

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
