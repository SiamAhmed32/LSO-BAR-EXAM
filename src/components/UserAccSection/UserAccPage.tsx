"use client";

import React, { useState, useEffect, useRef } from "react";
import Container from "../shared/Container";
import AccountSidebar from "./AccountSidebar";
import AccountDetails from "./AccountDetails";
import { useUser } from "@/components/context";
import { getExamStorageKeys, hasValidExamProgress } from "@/lib/utils/examStorage";
import { examApi } from "@/lib/api/examApi";
import Link from "next/link";
import Loader from "../shared/Loader";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchasedExam {
  frontendId: string;
  examId: string;
  examType: string;
  examSet: string;
  totalAttempts: number | null;
  usedAttempts: number;
  remainingAttempts: number | null;
  purchasedAt: string | null;
}

type Props = {};

const UserAccPage = (props: Props) => {
  const { user, isAuthenticated } = useUser();
  const [purchasedExams, setPurchasedExams] = useState<PurchasedExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [examProgressStatus, setExamProgressStatus] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const prevAuthState = useRef<boolean>(isAuthenticated);

  // Refresh page when authentication state changes from false to true
  useEffect(() => {
    if (!prevAuthState.current && isAuthenticated) {
      // User just logged in - refresh to get updated user data
      router.refresh();
    }
    prevAuthState.current = isAuthenticated;
  }, [isAuthenticated, router]);

  // Fetch purchased exams from API
  useEffect(() => {
    if (!isAuthenticated) {
      setPurchasedExams([]);
      setIsLoading(false);
      return;
    }

    const loadPurchasedExams = async () => {
      try {
        setIsLoading(true);
        const exams = await examApi.getPurchasedExamsDetailed();
        setPurchasedExams(exams);
      } catch (error) {
        console.error("Failed to load purchased exams:", error);
        setPurchasedExams([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPurchasedExams();
  }, [isAuthenticated]);

  // Check exam progress status for all purchased exams (user-specific)
  useEffect(() => {
    if (typeof window === "undefined" || purchasedExams.length === 0) return;

    const userId = user?.id || null;
    const status: Record<string, boolean> = {};
    
    purchasedExams.forEach((exam) => {
      // Get exam title based on exam type and set
      const examTitle = exam.examType === "BARRISTER" 
        ? `Barrister Exam ${exam.examSet === "SET_A" ? "Set A" : "Set B"}`
        : `Solicitor Exam ${exam.examSet === "SET_A" ? "Set A" : "Set B"}`;
      
      const storageKeys = getExamStorageKeys(examTitle, userId);
      status[exam.frontendId] = hasValidExamProgress(storageKeys);
    });    
    setExamProgressStatus(status);
  }, [purchasedExams, user?.id]);

  const getExamName = (exam: PurchasedExam) => {
    const type = exam.examType === "BARRISTER" ? "Barrister" : "Solicitor";
    const set = exam.examSet === "SET_A" ? "Set A" : "Set B";
    return `${type} Exam ${set}`;
  };

  const getBeginHref = (frontendId: string) => {
    if (frontendId === "barrister-set-a") return "/barrister-exam/set-a";
    if (frontendId === "barrister-set-b") return "/barrister-exam/set-b";
    if (frontendId === "solicitor-set-a") return "/solicitor-exam/set-a";
    if (frontendId === "solicitor-set-b") return "/solicitor-exam/set-b";
    return "#";
  };

  return (
    <section className="min-h-screen  bg-primaryBg py-16 sm:py-20 md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Sidebar - handles mobile drawer internally */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1 lg:pl-8 pt-8 lg:pt-0 pb-12">
            <div className="mb-6">
              <nav className="text-sm text-gray-500 mb-4">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span>Account</span>
                <span className="mx-2">/</span>
                <span className="text-primaryText font-semibold">
                  Account Details
                </span>
              </nav>
              <h1 className="text-3xl font-bold text-primaryText">
                Account Details
              </h1>
            </div>

            <AccountDetails />

            {/* Exams Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-primaryText mb-4">
                Your Purchased Exams
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader size="lg" />
                </div>
              ) : purchasedExams.length === 0 ? (
                <p className="text-primaryText/80 text-sm sm:text-base">
                  You have not purchased any paid exams yet. Go to{" "}
                  <Link href="/practice" className="text-primaryColor underline">
                    Practice Questions
                  </Link>{" "}
                  to purchase an exam.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {purchasedExams.map((exam) => {
                    const isExamInProgress = examProgressStatus[exam.frontendId] || false;
                    const hasCompletedAttempts = exam.usedAttempts > 0;
                    const hasRemainingAttempts = exam.remainingAttempts === null || exam.remainingAttempts > 0;
                    
                    // Determine status: In Progress > Completed > Ready to begin
                    let examStatus = "Ready to begin";
                    let statusColor = "text-gray-600";
                    if (isExamInProgress) {
                      examStatus = "In Progress";
                      statusColor = "text-yellow-600";
                    } else if (hasCompletedAttempts) {
                      examStatus = "Completed";
                      statusColor = "text-green-600";
                    }
                    
                    // Determine button text and href based on state
                    let buttonText: string;
                    let beginHref: string;
                    let showViewResultsButton = false;
                    
                    if (isExamInProgress) {
                      // Exam is in progress
                      buttonText = "Resume Exam";
                      beginHref = getBeginHref(exam.frontendId);
                    } else if (hasCompletedAttempts && !hasRemainingAttempts) {
                      // Exam completed and no attempts left - show View Results
                      buttonText = "View Results";
                      beginHref = "/user-account/exam-results";
                      showViewResultsButton = true;
                    } else if (hasCompletedAttempts && hasRemainingAttempts) {
                      // Exam completed but has remaining attempts - show Attempt Again
                      buttonText = "Attempt Again";
                      beginHref = getBeginHref(exam.frontendId);
                    } else {
                      // No attempts yet - show Begin Exam
                      buttonText = "Begin Exam";
                      beginHref = getBeginHref(exam.frontendId);
                    }

                    return (
                      <div
                        key={exam.examId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-borderBg rounded-lg bg-primaryCard p-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-primaryColor" />
                            <p className="text-primaryText font-semibold text-sm sm:text-base">
                              {getExamName(exam)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-primaryText/70">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Status:</span>
                              <span className={statusColor}>{examStatus}</span>
                            </span>
                            {exam.totalAttempts !== null && exam.totalAttempts > 0 && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {exam.remainingAttempts === null || exam.remainingAttempts > 0
                                    ? `${exam.remainingAttempts} of ${exam.totalAttempts} attempts remaining`
                                    : "No attempts remaining"}
                                </span>
                              </span>
                            )}
                            {exam.totalAttempts === null || exam.totalAttempts === 0 && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>Unlimited attempts</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {showViewResultsButton ? (
                            // View Results button (when no attempts left)
                            <Link
                              href={beginHref}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:opacity-90 transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {buttonText}
                            </Link>
                          ) : (
                            // Resume Exam, Attempt Again, or Begin Exam button
                            <Link
                              href={beginHref}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-semibold hover:opacity-90 transition ${
                                hasRemainingAttempts
                                  ? "bg-primaryColor"
                                  : "bg-gray-400 cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                if (!hasRemainingAttempts) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              {hasRemainingAttempts ? buttonText : "No Attempts Left"}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UserAccPage;