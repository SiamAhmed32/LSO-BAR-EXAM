"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/shared/Container";
import { CheckCircle } from "lucide-react";
import type { FreeQuestion } from "@/components/data/freeExamQuestions";

interface ExamResultsProps {
  examType: string;
  examSet: string;
  totalQuestions: number;
  answeredCount: number;
  title: string;
}

interface StoredResults {
  finished?: boolean; // Flag to verify exam was properly finished
  answers: Record<number, string | undefined>;
  questions: Array<{
    id: number;
    text: string;
    category: string;
    options: Array<{ id: string; text: string }>;
  }>;
  apiQuestions?: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
  }>;
}

const ExamResults: React.FC<ExamResultsProps> = ({
  examType,
  examSet,
  totalQuestions,
  answeredCount,
  title,
}) => {
  const router = useRouter();
  const [results, setResults] = useState<StoredResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [gradedResults, setGradedResults] = useState<{
    correct: number;
    incorrect: number;
    unanswered: number;
    sectionBreakdown: Array<{
      category: string;
      total: number;
      correct: number;
      incorrect: number;
      unanswered: number;
      percentage: number;
    }>;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem(`exam-results-${examType}-${examSet}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredResults;
        
        // CRITICAL: Only show results if exam was properly finished
        // If someone tries to access results page directly without finishing, redirect to home
        if (!parsed.finished) {
          console.warn("⚠️ Attempted to access results page without finishing exam. Redirecting...");
          setIsRedirecting(true);
          router.push("/");
          return;
        }
        
        setResults(parsed);
      } catch (error) {
        console.error("Error parsing stored results:", error);
        // If there's an error parsing, redirect to home
        setIsRedirecting(true);
        router.push("/");
      }
    } else {
      // No results data found, redirect to home
      console.warn("⚠️ No exam results found. Redirecting to home...");
      setIsRedirecting(true);
      router.push("/");
    }
    setIsLoading(false);
  }, [examType, examSet, router]);

  // Grade the exam by comparing answers with correct answers
  useEffect(() => {
    if (!results || !results.apiQuestions || results.apiQuestions.length === 0) {
      setIsCheckingAnswers(false);
      return;
    }

    // Simulate checking time (can be removed if not needed, or make it async if fetching from API)
    const checkAnswers = () => {
      let correct = 0;
      let incorrect = 0;
      let unanswered = 0;

      const sectionStats: Record<
        string,
        { total: number; correct: number; incorrect: number; unanswered: number }
      > = {};

      // Map API questions by their transformed ID (index + 1)
      results.apiQuestions!.forEach((apiQ, apiIndex) => {
        const questionId = apiIndex + 1; // Match the transformed ID
        const question = results.questions.find((q) => q.id === questionId);
        const category = question?.category || "General";

        if (!sectionStats[category]) {
          sectionStats[category] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
        }
        sectionStats[category].total += 1;

        const userAnswer = results.answers[questionId];
        const correctOption = apiQ.options.find((opt) => opt.isCorrect);
        const correctAnswerId = correctOption?.id;

        if (!userAnswer) {
          unanswered += 1;
          sectionStats[category].unanswered += 1;
        } else if (userAnswer === correctAnswerId) {
          correct += 1;
          sectionStats[category].correct += 1;
        } else {
          incorrect += 1;
          sectionStats[category].incorrect += 1;
        }
      });

      const sectionBreakdown = Object.entries(sectionStats).map(([category, stats]) => ({
        category,
        total: stats.total,
        correct: stats.correct,
        incorrect: stats.incorrect,
        unanswered: stats.unanswered,
        percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      }));

      setGradedResults({
        correct,
        incorrect,
        unanswered,
        sectionBreakdown,
      });
      setIsCheckingAnswers(false);
    };

    // Add a small delay to show loading state
    const timer = setTimeout(checkAnswers, 800);
    return () => clearTimeout(timer);
  }, [results]);

  const overallPercentage =
    gradedResults && totalQuestions > 0
      ? (gradedResults.correct / totalQuestions) * 100
      : 0;

  // If redirecting, don't render anything
  if (isRedirecting) {
    return null;
  }

  // While loading from storage or grading answers, show loader only
  // and avoid rendering an intermediate, incorrect summary state.
  if (isLoading || isCheckingAnswers || !gradedResults) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-primaryColor/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-primaryText font-medium text-lg">
              {isCheckingAnswers || !results
                ? "Checking your answers..."
                : "Loading results..."}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Thank You Banner */}
          <div className="bg-primaryColor text-white rounded-lg p-6 sm:p-8 mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
            <p className="text-lg sm:text-xl">
              Thank you for completing the exam. Here is your result:
            </p>
          </div>

          {/* Results Summary */}
          <div className="bg-white rounded-lg border border-borderBg shadow-sm p-6 sm:p-8 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-6">
              Results:
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-primaryText/70 font-medium">
                  Exam Type:{" "}
                </span>
                <span className="text-primaryText font-semibold">{title}</span>
              </div>
              <div>
                <span className="text-primaryText/70 font-medium">
                  Overall Score:{" "}
                </span>
                <span className="text-primaryText font-semibold">
                  {gradedResults
                    ? `${gradedResults.correct} out of ${totalQuestions}`
                    : `${answeredCount} out of ${totalQuestions}`}
                </span>
              </div>
              {gradedResults && (
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-borderBg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {gradedResults.correct}
                    </p>
                    <p className="text-xs text-primaryText/70">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {gradedResults.incorrect}
                    </p>
                    <p className="text-xs text-primaryText/70">Incorrect</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">
                      {gradedResults.unanswered}
                    </p>
                    <p className="text-xs text-primaryText/70">Unanswered</p>
                  </div>
                </div>
              )}
              <div>
                <span className="text-primaryText/70 font-medium">
                  Overall Percentage:{" "}
                </span>
                <span className="text-primaryText font-semibold text-2xl">
                  {overallPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Section Breakdown */}
          {gradedResults && gradedResults.sectionBreakdown.length > 0 && (
            <div className="bg-white rounded-lg border border-borderBg shadow-sm p-6 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-6">
                Section Breakdown:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {gradedResults.sectionBreakdown.map((section) => (
                  <div
                    key={section.category}
                    className="bg-primaryColor/5 border border-borderBg rounded-lg p-4 text-center"
                  >
                    <h3 className="text-sm font-semibold text-primaryText mb-2">
                      {section.category}
                    </h3>
                    <p className="text-2xl font-bold text-primaryColor mb-1">
                      {section.percentage.toFixed(2)}%
                    </p>
                    <p className="text-xs text-primaryText/70 mb-1">
                      ({section.correct}/{section.total})
                    </p>
                    <div className="flex justify-center gap-2 mt-2 text-xs">
                      <span className="text-green-600">✓ {section.correct}</span>
                      <span className="text-red-600">✗ {section.incorrect}</span>
                      {section.unanswered > 0 && (
                        <span className="text-gray-600">○ {section.unanswered}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-primaryColor text-white font-semibold rounded-md hover:opacity-90 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExamResults;

