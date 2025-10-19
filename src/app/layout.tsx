import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/context/global-context";
import * as Sidebar from "@/ui/atoms/sidebar";
import { Toaster } from "@/ui/atoms/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How I Code",
  description:
    "An evolving space to document my preferred methods of building software",
};

export default function RootLayout({
  children,
  channel,
}: Readonly<{
  children: React.ReactNode;
  channel: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProviders>
          <Toaster />
          <Sidebar.Frame>
            <Sidebar.Content className="flex items-center justify-center">
              {channel}
            </Sidebar.Content>
          </Sidebar.Frame>
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
