import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const migratePFPtoUploadThing = internalMutation({
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    await Promise.all(
      profiles.map(async (profile) => {
        const githubImage = profile.image;
        if (!githubImage) return;
        ctx.scheduler.runAfter(0, internal.uploadthing.uploadPFP, {
          profileId: profile._id,
          url: githubImage,
        });
      }),
    );
  },
});
