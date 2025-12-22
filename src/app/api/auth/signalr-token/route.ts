import { NextResponse } from "next/server";
import { getSessionWithRefresh } from "@/lib/session";

export async function GET() {
  const session = await getSessionWithRefresh();

  console.log(session);
  if (!session?.token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ token: session.token });
}
