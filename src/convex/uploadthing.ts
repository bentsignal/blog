"use node";

import { tryCatch } from "@/utils/error-utils";
import { v } from "convex/values";
import { UTApi, UTFile } from "uploadthing/server";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
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
  const orgID = process.env.UPLOADTHING_ORG_ID!;
  return `https://${orgID}.ufs.sh/f/${key}`;
};

export const downloadImage = async (url: string) => {
  const download = await tryCatch(fetch(url));
  if (download.error) {
    throw new Error(`Error downloading image: ${download.error.message}`);
  }
  const conversion = await tryCatch(download.data.arrayBuffer());
  if (conversion.error) {
    throw new Error(
      `Error converting image to uint8Array: ${conversion.error.message}`,
    );
  }
  const uint8Array = new Uint8Array(conversion.data);

  return uint8Array;
};

export const uploadImage = async (image: Uint8Array, fileName: string) => {
  // upload image to uploadthing
  const arrayBuffer = new ArrayBuffer(image.length);
  const view = new Uint8Array(arrayBuffer);
  view.set(image);
  const blob = new Blob([view], { type: "image/png" });
  const file = new UTFile([blob], fileName, { type: "image/png" });
  const uploadedFile = await utapi.uploadFiles(file);
  if (uploadedFile.error) {
    throw new Error(
      `Error uploading image to uploadthing: ${uploadedFile.error.message}`,
    );
  }
  return uploadedFile.data.key;
};
