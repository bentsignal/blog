const APP_HOST = "blog.bentsignal";

function normalizeWorktreeId(worktreeId: string | undefined) {
  const slug = worktreeId
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    return undefined;
  }

  const t3WorktreeId = /(?:^|-)([a-f0-9]{8})$/.exec(slug);
  return t3WorktreeId?.[1] ?? slug;
}

function getSiteUrl() {
  if (process.env.NODE_ENV === "production") {
    return `https://${APP_HOST}.com`;
  }

  const prefix = normalizeWorktreeId(process.env.PORTLESS_WORKTREE_ID);
  const host = [prefix, APP_HOST, "localhost"].filter(Boolean).join(".");
  return new URL(`https://${host}`).origin;
}

export const siteUrl = getSiteUrl();
