import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/session";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth Check Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
