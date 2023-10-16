import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import AuthMessage from "@/components/auth-message";
import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <AuthMessage />
    </main>
  );
}
