export const vars = [
  "CONVEX_SITE_URL",
  "SITE_URL",
  "BETTER_AUTH_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "UPLOADTHING_TOKEN",
  "UPLOADTHING_ORG_ID",
  "INBOUND_API_KEY",
] as const;

export const env = vars.reduce(
  (acc, name) => {
    acc[name] = process.env[name]!;
    return acc;
  },
  {} as Record<(typeof vars)[number], string>,
);

export const verifyEnv = () => {
  vars.forEach((name) => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error("Missing environment variable: " + name);
    }
  });
};
