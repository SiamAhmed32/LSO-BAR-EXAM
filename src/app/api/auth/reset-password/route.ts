import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOTP } from "@/lib/utils/otp";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ratelimit } from "@/lib/server/ratelimit";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, otp, password } = result.data;

    // Rate limiting
    const identifier = `reset-password:${email}`;
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
        { error: "User not found", message: "No account found with this email address." },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}

