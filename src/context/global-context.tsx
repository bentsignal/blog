import { Provider as AuthProvider } from "./auth-context";
import { ConvexClientProvider } from "./convex-context";
import { ThemeProvider } from "./theme-context";
import { Provider as SidebarProvider } from "@/ui/atoms/sidebar";
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
      <AuthProvider isAuthenticatedServerSide={authed}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </ConvexClientProvider>
  );
};
