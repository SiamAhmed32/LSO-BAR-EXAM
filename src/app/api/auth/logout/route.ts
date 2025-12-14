import { NextResponse } from "next/server";
import { deleteSession, clearSessionCookie } from "@/lib/server/session";

export async function POST(): Promise<NextResponse> {
  try {
    await deleteSession();
    await clearSessionCookie();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
