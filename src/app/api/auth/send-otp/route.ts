import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOTPEmail } from "@/lib/utils/email";
import { hasOTP } from "@/lib/utils/otp";
import { ratelimit } from "@/lib/server/ratelimit";
import prisma from "@/lib/prisma";

const sendOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = sendOTPSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Rate limiting - use email as identifier
    const identifier = `otp:${email}`;
    const { success } = await ratelimit.limit(identifier);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", message: "Please wait before requesting another OTP" },
        { status: 429 }
      );
    }

    // Check if OTP already exists (prevent spam)
    const existingOTP = await hasOTP(email);
    if (existingOTP) {
      return NextResponse.json(
        { error: "OTP already sent", message: "Please check your email or wait a few minutes before requesting a new OTP" },
        { status: 400 }
      );
    }

    // Check if user exists (for login) - optional, we can send OTP even if user doesn't exist
    // This prevents email enumeration attacks
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true },
    });

    // Send OTP email (always send, even if user doesn't exist, to prevent email enumeration)
    await sendOTPEmail(email, user?.name || undefined);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email address",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}

