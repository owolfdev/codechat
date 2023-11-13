import supabase from "@/lib/supabase-client";

export async function PUT(req: Request) {
  //udate the date in the database
  await supabase
    .from("update")
    .update({
      date: new Date().toISOString(),
    })
    .eq("id", 1);

  const { data } = await supabase.from("update").select("*");

  const responseData = {
    data,
  };

  return new Response(JSON.stringify(responseData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET() {
  const { data } = await supabase.from("update").select("*");

  await supabase
    .from("update")
    .update({
      date: new Date().toISOString(),
    })
    .eq("id", 1);

  return new Response(`Hello, Next.js! ${JSON.stringify(data)}`);
}
