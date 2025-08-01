import { auth } from "@/auth"; // Update this import to match your auth.js/ts file
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}