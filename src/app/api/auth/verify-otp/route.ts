import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOTP } from "@/lib/utils/otp";
import prisma from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = verifyOTPSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, otp } = result.data;

    // Rate limiting
    const identifier = `verify-otp:${email}`;
    const { success } = await ratelimit.limit(identifier);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", message: "Please wait before trying again" },
        { status: 429 }
      );
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(email, otp);
    
    if (!isValidOTP) {
      return NextResponse.json(
        { error: "Invalid or expired OTP", message: "The OTP you entered is invalid or has expired. Please request a new one." },
        { status: 401 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "No account found with this email address. Please sign up first." },
        { status: 404 }
      );
    }

    // Create session
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
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}

