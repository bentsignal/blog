const vars = [
  "BETTER_AUTH_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "SITE_URL",
] as const;

export const verifyEnv = () => {
  vars.forEach((name) => {
    const value = process.env[name];
    if (value === undefined) {
      console.error("Missing environment variable:", name);
      throw new Error("Missing environment variable: " + name);
    }
  });
};
