import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Mono } from "next/font/google";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/nav/site-header";
import { Toaster } from "@/components/ui/toaster";

import Footer from "@/components/nav/footer";

export const metadata: Metadata = {
  title: "Code Chat",
  description: "Code Chat is a chat app for developers.",
};

const openSans = Open_Sans({
  subsets: ["latin"],
});

const IBM_Plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        // className={`${IBM_Plex.variable} ibm-plex-mono`}
      >
        <body
          className={`ibm-plex-mono flex flex-col min-h-screen`}
          style={IBM_Plex.style}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteHeader />
            <div className="flex-1">
              <main className="flex flex-col items-center justify-between sm:px-24 sm:py-24 py-8 px-8 gap-4">
                {children}
              </main>
              <Toaster />
            </div>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
