import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  NEXT_PUBLIC_SUPABASE_KEY as string
);

export async function POST() {
  console.log("api/update-supabase/route.ts");

  const data = await supabase
    .from("update")

    .update({ date: new Date().toISOString() })

    .eq("id", 1); // replace 1 with the ID of the row you want to update

  if (data.error) {
    return NextResponse.error();
  }

  console.log("heres the data:", data);

  return NextResponse.json({
    message: `Success! ${NEXT_PUBLIC_SUPABASE_URL} ${NEXT_PUBLIC_SUPABASE_KEY}`,
    data,
  });
}
