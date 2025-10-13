import { ConvexClientProvider } from "./convex-provider";
import { ThemeProvider } from "./theme-provider";
import * as Auth from "@/components/auth";
import { getToken } from "@/lib/auth-server";

export const GlobalProviders = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = await getToken();
  const authed = token !== undefined;
  return (
    <ConvexClientProvider>
      <Auth.Provider isAuthenticatedServerSide={authed}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </Auth.Provider>
    </ConvexClientProvider>
  );
};
