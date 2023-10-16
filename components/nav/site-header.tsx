import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

// import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
// import { Icons } from "@/components/icons";
// import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        {/* <MainNav items={siteConfig.mainNav} /> */}
        <nav className="flex gap-4 items-center">
          <div className="font-bold text-xl tracking-tight">
            <Link href="/">CodeChat</Link>{" "}
          </div>
          <div className="text-md">
            <Link href="/about">/about</Link>
          </div>
        </nav>
        <div className="flex items-center justify-end flex-1 space-x-4">
          <div className="flex gap-4 items-center">
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
