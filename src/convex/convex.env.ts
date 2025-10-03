const vars = [
  "SITE_URL",
  "BETTER_AUTH_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "UPLOADTHING_TOKEN",
  "UPLOADTHING_ORG_ID",
] as const;

export const verifyEnv = () => {
  vars.forEach((name) => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error("Missing environment variable: " + name);
    }
  });
};
