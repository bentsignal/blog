"use node";

import { v } from "convex/values";
import { UTApi, UTFile } from "uploadthing/server";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { env } from "@/convex/convex.env";

export const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
});

export const uploadPFP = internalAction({
  args: {
    profileId: v.id("profiles"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await downloadImage(args.url);
    const fileName = `${args.profileId.toString()}-pfp`;
    const key = await uploadImage(image, fileName);
    await ctx.runMutation(internal.user.updatePFP, {
      profileId: args.profileId,
      key,
    });
  },
});

export const getFileURL = (key: string) => {
  const orgID = env.UPLOADTHING_ORG_ID;
  return `https://${orgID}.ufs.sh/f/${key}`;
};

export const downloadImage = async (url: string) => {
  return await fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buffer) => new Uint8Array(buffer));
};

export const uploadImage = async (image: Uint8Array, fileName: string) => {
  const arrayBuffer = new ArrayBuffer(image.length);
  const view = new Uint8Array(arrayBuffer);
  view.set(image);
  const blob = new Blob([view], { type: "image/png" });
  const file = new UTFile([blob], fileName, { type: "image/png" });
  const uploadedFile = await utapi.uploadFiles(file);
  if (uploadedFile.error) {
    throw new Error(`Error uploading image to uploadthing`, {
      cause: uploadedFile.error,
    });
  }
  return uploadedFile.data.key;
};

export const deleteFile = internalAction({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    return await utapi.deleteFiles([args.key]);
  },
});
