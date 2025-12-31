import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOTP } from "@/lib/utils/otp";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, setSessionCookie } from "@/lib/server/session";
import { ratelimit } from "@/lib/server/ratelimit";

const verifySignupOTPSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6).max(50),
  otp: z.string().length(6, "OTP must be 6 digits"),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = verifySignupOTPSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, otp, role } = result.data;

    // Rate limiting
    const identifier = `verify-signup-otp:${email}`;
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", message: "An account with this email already exists. Please login instead." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        role: role || "USER",
      },
    });

    // Create session
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
    console.error("Verify Signup OTP Error:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

