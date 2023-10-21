import { createClient } from "@supabase/supabase-js";

export function initializeSupabaseClient(supabaseAccessToken: string | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );
}
