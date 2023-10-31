import { getUserById } from "@/lib/clerkUtils";
export async function POST(req: Request) {
  const { id } = await req.json();
  // console.log(id);

  const user = await getUserById(id);

  const responseData = { data: user, message: `Hello, Next.js! ${user}` };
  return new Response(JSON.stringify(responseData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
