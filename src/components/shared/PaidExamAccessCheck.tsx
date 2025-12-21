"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "./Container";
import { examApi } from "@/lib/api/examApi";
import { ShoppingCart, AlertCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/components/context";

interface PaidExamAccessCheckProps {
  examId: string; // Frontend ID like "barrister-set-a"
  examName: string; // Display name like "Barrister Exam Set A"
  children: React.ReactNode;
}

const PaidExamAccessCheck: React.FC<PaidExamAccessCheckProps> = ({
  examId,
  examName,
  children,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [purchasedExam, setPurchasedExam] = useState<{
    frontendId: string;
    examId: string;
    totalAttempts: number | null;
    usedAttempts: number;
    remainingAttempts: number | null;
  } | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsChecking(true);
        
        // Admins have automatic access without purchase
        if (user?.role === "ADMIN") {
          setHasAccess(true);
          setIsChecking(false);
          return;
        }
        
        // Get all purchased exams
        const purchasedExams = await examApi.getPurchasedExamsDetailed();
        
        // Find if this exam is purchased
        const exam = purchasedExams.find((e) => e.frontendId === examId);
        
        if (!exam) {
          // Exam not purchased
          setHasAccess(false);
          setPurchasedExam(null);
          setIsChecking(false);
          return;
        }

        // Check remaining attempts
        const hasRemainingAttempts = exam.remainingAttempts === null || exam.remainingAttempts > 0;
        
        if (!hasRemainingAttempts) {
          // No attempts left
          setHasAccess(false);
          setPurchasedExam(exam);
          setIsChecking(false);
          return;
        }

        // Has access
        setHasAccess(true);
        setPurchasedExam(exam);
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking exam access:", error);
        setHasAccess(false);
        setIsChecking(false);
      }
    };

    void checkAccess();
  }, [examId, user?.role]);

  if (isChecking) {
    return (
      <section className="py-24 lg:py-28 bg-primaryBg min-h-screen">
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-primaryColor/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-primaryText font-medium text-lg">Checking exam access...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (!hasAccess) {
    return (
      <section className="py-24 lg:py-28 bg-primaryBg min-h-screen">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm p-8 text-center">
              {!purchasedExam ? (
                // Not purchased
                <>
                  <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-primaryText mb-4">
                    Exam Not Purchased
                  </h1>
                  <p className="text-primaryText/70 text-lg mb-6">
                    You need to purchase <span className="font-semibold">{examName}</span> before
                    you can take this exam.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/practice"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primaryColor text-white font-semibold rounded-md hover:opacity-90 transition"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Purchase Exam
                    </Link>
                    <Link
                      href="/user-account"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-primaryText font-semibold rounded-md hover:bg-gray-300 transition"
                    >
                      My Account
                    </Link>
                  </div>
                </>
              ) : (
                // No attempts left
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-primaryText mb-4">
                    No Attempts Remaining
                  </h1>
                  <p className="text-primaryText/70 text-lg mb-2">
                    You have used all your attempts for <span className="font-semibold">{examName}</span>.
                  </p>
                  {purchasedExam.totalAttempts !== null && (
                    <p className="text-primaryText/60 text-sm mb-6">
                      You used {purchasedExam.usedAttempts} of {purchasedExam.totalAttempts} attempts.
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/practice"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primaryColor text-white font-semibold rounded-md hover:opacity-90 transition"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Purchase More Attempts
                    </Link>
                    <Link
                      href="/user-account/exam-results"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-primaryText font-semibold rounded-md hover:bg-gray-300 transition"
                    >
                      View Results
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // Has access - render children
  return <>{children}</>;
};

export default PaidExamAccessCheck;

