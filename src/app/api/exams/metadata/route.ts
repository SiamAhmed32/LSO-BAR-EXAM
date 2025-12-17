import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Public endpoint to get exam metadata (price, duration) for all paid exams
// No authentication required - prices should be visible to everyone
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Fetch all paid exams (Barrister Set A/B, Solicitor Set A/B)
    const exams = await prisma.exam.findMany({
      where: {
        pricingType: "PAID",
        examType: {
          in: ["BARRISTER", "SOLICITOR"],
        },
        examSet: {
          in: ["SET_A", "SET_B"],
        },
      },
      select: {
        id: true,
        examType: true,
        examSet: true,
        price: true,
        examTime: true,
      },
    });

    // Transform to a more frontend-friendly format
    const metadata = exams.reduce(
      (acc, exam) => {
        const key = `${exam.examType.toLowerCase()}-set-${exam.examSet === "SET_A" ? "a" : "b"}`;
        acc[key] = {
          price: exam.price ?? 0,
          examTime: exam.examTime ?? "Duration not set",
        };
        return acc;
      },
      {} as Record<
        string,
        {
          price: number;
          examTime: string;
        }
      >
    );

    return NextResponse.json(
      {
        success: true,
        message: "Exam metadata retrieved successfully",
        data: metadata,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Exam Metadata GET Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to retrieve exam metadata",
      },
      { status: 500 }
    );
  }
}

