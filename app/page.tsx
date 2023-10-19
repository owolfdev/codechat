import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import AuthMessage from "@/components/auth-message";
import { ModeToggle } from "@/components/theme-toggle";
import SupabaseData from "@/components/supabase-data";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">Home</h1>
      <SupabaseData />
      <AuthMessage />
    </>
  );
}
