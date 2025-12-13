import prisma from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/server/session";
import { userLoginSchema } from "@/validation/userAuth.validation";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = userLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValidPassCode = await bcrypt.compare(password, user.password);
    if (!isValidPassCode) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const sessionId = await createSession(user);
    await setSessionCookie(sessionId);
    return NextResponse.json(
      {
        success: true,
        message: "Login Successful",
        userId: user.id,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
