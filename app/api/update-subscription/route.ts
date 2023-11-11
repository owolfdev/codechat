import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payer = await req.json().then((data) => data.payer);
  return NextResponse.json({ message: `Success! ${payer}` });
}
