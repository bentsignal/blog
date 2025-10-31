import { Provider as AuthProvider } from "@/context/auth-context";
import { Provider as ChatWindowProvider } from "@/context/chat-window-context";
import { Provider as ConvexProvider } from "@/context/convex-context";
import { Provider as ThemeProvider } from "@/context/theme-context";
import { headers } from "next/headers";
import * as Sidebar from "@/ui/atoms/sidebar";
import { getToken } from "@/lib/auth-server";

export const Provider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersList = await headers();
  const slug = headersList.get("x-slug");

  const token = await getToken();
  const authed = token !== undefined;

  return (
    <ConvexProvider>
      <AuthProvider isAuthenticatedServerSide={authed}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ChatWindowProvider slugFromHeaders={slug}>
            <Sidebar.Provider>{children}</Sidebar.Provider>
          </ChatWindowProvider>
        </ThemeProvider>
      </AuthProvider>
    </ConvexProvider>
  );
};
