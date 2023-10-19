"use client";

import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = async (supabaseAccessToken: any) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );
  // set Supabase JWT on the client object,
  // so it is sent up with all Supabase requests
  return supabase;
};

export default function SupabaseData() {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  const fetchData = async () => {
    console.log("fetching data");
    console.log("user:", user);
    // TODO #1: Replace with your JWT template name
    const supabaseAccessToken = await getToken({
      template: "supabase-codechat",
    });

    const supabase = await supabaseClient(supabaseAccessToken);

    // TODO #2: Replace with your database table name

    const { data, error } = await supabase.from("test_table").select();

    console.log("data:", data, "error:", error);

    // TODO #3: Handle the response
  };

  const addData = async () => {
    console.log("adding data");
    // TODO #1: Replace with your JWT template name
    const supabaseAccessToken = await getToken({
      template: "supabase-codechat",
    });

    const supabase = await supabaseClient(supabaseAccessToken);

    // TODO #2: Replace with your database table name

    const date = new Date();
    const dateStr = date.toISOString();
    const stringToInsert = `inserted at: ${dateStr}`;
    const dataToInsert = [{ data: stringToInsert, user: user?.id }];

    const { data, error } = await supabase
      .from("test_table")
      .insert(dataToInsert);

    console.log("data:", data, "error:", error);

    // TODO #3: Handle the response
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl">Supabase Data Insert and Fetch</h2>
      <button onClick={fetchData}>Fetch data</button>
      <button onClick={addData}>Add data</button>
    </div>
  );
}
