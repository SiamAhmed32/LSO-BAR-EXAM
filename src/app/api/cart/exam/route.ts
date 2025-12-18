import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Helper function to get current user
async function getCurrentUser() {
  const sessionUser = await getSession();
  if (!sessionUser) {
    throw new Error("Authentication required");
  }
  return sessionUser;
}

// DELETE /api/cart/exam - Delete cart for a specific exam
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const currentUser = await getCurrentUser();
    
    const url = new URL(request.url);
    const examId = url.searchParams.get("examId");

    if (!examId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Exam ID is required" 
        },
        { status: 400 }
      );
    }

    // Validate exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Exam not found" 
        },
        { status: 404 }
      );
    }

    // Find and delete cart for this user and exam
    const cart = await prisma.cart.findFirst({
      where: {
        userId: currentUser.id,
        examId: examId,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cart not found for this exam" 
        },
        { status: 404 }
      );
    }

    // Delete the cart (cascade will delete items)
    await prisma.cart.delete({
      where: {
        id: cart.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Exam removed from cart successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/cart/exam Error:", error);
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Authentication required" 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error" 
      },
      { status: 500 }
    );
  }
}

