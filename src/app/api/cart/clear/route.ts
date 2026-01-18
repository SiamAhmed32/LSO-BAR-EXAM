import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/server/session";

interface ApiResponse {
  success: boolean;
  message?: string;
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

// DELETE /api/cart/clear - Clear all items from user's cart
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const currentUser = await getCurrentUser();
    
    // Delete all carts for this user
    const result = await prisma.cart.deleteMany({
      where: {
        userId: currentUser.id,
      },
    });

    console.log(`Cleared ${result.count} carts for user ${currentUser.id} via API request`);

    return NextResponse.json(
      {
        success: true,
        message: "Cart cleared successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/cart/clear Error:", error);
    
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
