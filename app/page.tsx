import AuthMessage from "@/components/auth-message";
import SupabaseData from "@/components/supabase-data";
import Users from "@/components/users";

export default async function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">Home</h1>
      <Users />
      <SupabaseData />
      <AuthMessage />
    </>
  );
}
