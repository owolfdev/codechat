import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Mono } from "@next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/nav/site-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Code Chat",
  description: "Code Chat is a chat app for developers.",
};

const IBM_Plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ibm-plex-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${IBM_Plex.variable} ibm-plex-mono`}
      >
        <body className="flex flex-col min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteHeader />

            <div className="flex-1">{children}</div>

            <footer className="flex items-center justify-center w-full h-24 border-t">
              <div className="flex sm:flex-row flex-col gap-2 sm:gap-4 justify-center align-center items-center">
                {" "}
                &copy; CodeChat {currentYear}
                <div>
                  <Link href="/">Home - </Link>
                  <Link href="/about">About - </Link>
                  <Link href="/contact">Contact - </Link>{" "}
                  <Link href="/privacy">Privacy</Link>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
