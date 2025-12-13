import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { userRegistrationSchema } from "@/validation/userAuth.validation";
import { createSession, setSessionCookie } from "@/lib/server/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = userRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        role: role || "USER",
      },
    });

    const sessionId = await createSession(user);
    await setSessionCookie(sessionId);
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: { user },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
