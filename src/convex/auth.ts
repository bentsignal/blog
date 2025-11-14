import { env } from "@/convex/convex.env";
import { defaultNotificationSettings } from "@/types/notification-types";
import {
  AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { deleteAllFromUser as deleteAllMessagesFromUser } from "./messages";
import { deleteAllForUser as deleteAllNotificationsForUser } from "./notifications";
import { deleteForUser as deletePreferencesForUser } from "./preferences";
import { getProfileByUserId } from "./user";

const authFunctions: AuthFunctions = internal.auth;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onDelete: async (ctx, authUser) => {
        const profile = await getProfileByUserId(ctx, authUser._id);
        if (!profile) return;
        await deleteAllMessagesFromUser(ctx, profile._id);
        await deletePreferencesForUser(ctx, profile._id);
        await deleteAllNotificationsForUser(ctx, profile._id);
        if (profile.imageKey) {
          await ctx.scheduler.runAfter(0, internal.uploadthing.deleteFile, {
            key: profile.imageKey!,
          });
        }
        await ctx.db.delete(profile._id);
      },
      onCreate: async (ctx, authUser) => {
        const profile = await ctx.db.insert("profiles", {
          user: authUser._id,
          name: authUser.name,
        });
        await ctx.db.insert("preferences", {
          profile,
          notifications: defaultNotificationSettings,
        });
        if (authUser.image) {
          await ctx.scheduler.runAfter(0, internal.uploadthing.uploadPFP, {
            profileId: profile,
            url: authUser.image,
          });
        }
      },
      onUpdate: async (ctx, authUser) => {
        const profile = await getProfileByUserId(ctx, authUser._id);
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
    baseURL: env.SITE_URL,
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
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
  });
};

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
