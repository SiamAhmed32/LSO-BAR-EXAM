import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";
import { addToCartSchema, removeFromCartSchema } from "@/validation/cart.validation";

// Types for API responses
interface CartItem {
  id: string;
  questionId: string;
  question: {
    id: string;
    question: string;
  };
}

interface CartData {
  id: string;
  userId: string;
  examId: string;
  exam: {
    id: string;
    examType: string;
    title: string | null;
    description: string | null;
  };
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

// Helper function to get current user
async function getCurrentUser() {
  const sessionUser = await getSession();
  if (!sessionUser) {
    throw new Error("Authentication required");
  }
  return sessionUser;
}

// Helper function to validate and get cart or create if doesn't exist
async function getOrCreateCart(userId: string, examId: string): Promise<CartData> {
  let cart = await prisma.cart.findUnique({
    where: {
      userId: userId,
    },
    include: {
      exam: {
        select: {
          id: true,
          examType: true,
          title: true,
          description: true,
        },
      },
      items: {
        include: {
          question: {
            select: {
              id: true,
              question: true,
            },
          },
        },
      },
    },
  });

  // If cart doesn't exist, create it
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId,
        examId: examId,
      },
      include: {
        exam: {
          select: {
            id: true,
            examType: true,
            title: true,
            description: true,
          },
        },
        items: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
              },
            },
          },
        },
      },
    });
  }

  return cart as CartData;
}

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<CartData>>> {
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

    const cart = await getOrCreateCart(currentUser.id, examId);

    return NextResponse.json(
      {
        success: true,
        data: cart,
        message: "Cart retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/cart Error:", error);
    
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

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<CartData>>> {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    
    const validation = addToCartSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { questionId, examId } = validation.data;

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

    // Validate question exists and belongs to the exam
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        examId: examId,
      },
    });

    if (!question) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Question not found in the specified exam" 
        },
        { status: 404 }
      );
    }

    // Get or create cart
    const cart = await getOrCreateCart(currentUser.id, examId);

    // Check if item already exists in cart
    const existingItem = await prisma.item.findUnique({
      where: {
        cartId_questionId: {
          cartId: cart.id,
          questionId: questionId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Question already in cart" 
        },
        { status: 409 }
      );
    }

    // Add item to cart
    await prisma.item.create({
      data: {
        cartId: cart.id,
        questionId: questionId,
      },
    });

    // Fetch updated cart with items
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        exam: {
          select: {
            id: true,
            examType: true,
            title: true,
            description: true,
          },
        },
        items: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
              },
            },
          },
        },
      },
    });

    if (!updatedCart) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to retrieve updated cart" 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedCart as CartData,
        message: "Question added to cart successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/cart Error:", error);
    
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

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<CartData>>> {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    
    const validation = removeFromCartSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { questionId } = validation.data;

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: currentUser.id },
    });

    if (!cart) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cart not found" 
        },
        { status: 404 }
      );
    }

    // Check if item exists in cart
    const existingItem = await prisma.item.findUnique({
      where: {
        cartId_questionId: {
          cartId: cart.id,
          questionId: questionId,
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Question not found in cart" 
        },
        { status: 404 }
      );
    }

    // Remove item from cart
    await prisma.item.delete({
      where: {
        cartId_questionId: {
          cartId: cart.id,
          questionId: questionId,
        },
      },
    });

    // Fetch updated cart with items
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        exam: {
          select: {
            id: true,
            examType: true,
            title: true,
            description: true,
          },
        },
        items: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedCart as CartData,
        message: "Question removed from cart successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/cart Error:", error);
    
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