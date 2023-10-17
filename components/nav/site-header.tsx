import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="sm:px-8 px-4 flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <nav className="flex gap-4 items-center">
          <div className="font-bold text-2xl tracking-tight">
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
