import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import AuthMessage from "@/components/auth-message";
import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between sm:px-24 py-24 px-8">
      <AuthMessage />
    </main>
  );
}
