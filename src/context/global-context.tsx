import { Provider as ChatWindowProvider } from "@/context/chat-window-context";
import { Provider as ConvexProvider } from "@/context/convex-context";
import { cookies, headers } from "next/headers";
import { Provider as AuthProvider } from "@/atoms/auth";
import * as Sidebar from "@/atoms/sidebar";
import { Provider as ThemeProvider } from "@/atoms/theme";
import { getToken } from "@/lib/auth-server";

export const Providers = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersList = await headers();
  const slug = headersList.get("x-slug");

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");

  const token = await getToken();
  const authed = token !== undefined;

  return (
    <ConvexProvider>
      <AuthProvider isAuthenticatedServerSide={authed}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          themeCookieValue={themeCookie?.value}
        >
          <ChatWindowProvider slugFromHeaders={slug}>
            <Sidebar.Provider>{children}</Sidebar.Provider>
          </ChatWindowProvider>
        </ThemeProvider>
      </AuthProvider>
    </ConvexProvider>
  );
};
