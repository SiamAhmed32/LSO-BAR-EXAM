"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/shared/Container";
import { CheckCircle, X, Eye, Home, ChevronLeft, ChevronRight } from "lucide-react";
import type { FreeQuestion } from "@/components/data/freeExamQuestions";
import { useUser } from "@/components/context";
import { examApi } from "@/lib/api/examApi";

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
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [results, setResults] = useState<StoredResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showSummary, setShowSummary] = useState(true); // Show summary first, then detailed view
  const [currentIndex, setCurrentIndex] = useState(0); // Track which question result is being viewed
  const [examName, setExamName] = useState<string>(title); // Store exam name from backend or use prop
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
    questionStatuses: Array<{
      questionId: number;
      isCorrect: boolean;
      isUnanswered: boolean;
    }>;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadResults = async () => {
      const attemptId = searchParams.get("attemptId");
      
      // For logged-in users with attemptId, fetch from backend (more secure)
      if (attemptId && user?.id) {
        try {
          console.log("🔒 Fetching results from backend for attemptId:", attemptId);
          const attemptData = await examApi.getExamAttempt(attemptId);
          
          // Get exam name from backend
          const exam = attemptData.attempt.exam;
          // Always generate name from examType and examSet (ignore title field)
          // This ensures consistent naming based on backend data
          const type = exam.examType === "BARRISTER" ? "Barrister" : "Solicitor";
          const set = exam.examSet === "SET_A" ? "Set A" : exam.examSet === "SET_B" ? "Set B" : "";
          setExamName(`${type} ${set}`.trim());
          
          // Transform backend data to match StoredResults format
          const transformedResults: StoredResults = {
            finished: true,
            answers: {},
            questions: attemptData.questions.map((q) => ({
              id: q.questionNumber,
              text: q.question,
              category: (q as any).category || "General", // Use category from backend or fallback
              options: q.options.map((opt) => ({
                id: opt.id,
                text: opt.text,
              })),
            })),
            apiQuestions: attemptData.questions.map((q) => ({
              id: q.id,
              question: q.question,
              options: q.options.map((opt) => ({
                id: opt.id,
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
            })),
          };

          // Map user answers
          attemptData.questions.forEach((q) => {
            if (q.userAnswerId) {
              transformedResults.answers[q.questionNumber] = q.userAnswerId;
            }
          });

          setResults(transformedResults);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error("❌ Failed to fetch results from backend, falling back to sessionStorage:", error);
          // Fall through to sessionStorage fallback
        }
      }

      // Fallback to sessionStorage (for guests or if backend fetch fails)
      const userId = user?.id || null;
      const userPrefix = userId ? userId : "guest";
      const resultsKey = `exam-results-${userPrefix}-${examType}-${examSet}`;
      
      const stored = sessionStorage.getItem(resultsKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as StoredResults;

          // CRITICAL: Only show results if exam was properly finished
          // If someone tries to access results page directly without finishing, redirect to home
          if (!parsed.finished) {
            console.warn(
              "⚠️ Attempted to access results page without finishing exam. Redirecting..."
            );
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
    };

    loadResults();
  }, [examType, examSet, router, searchParams, user?.id]);

  // Grade the exam by comparing answers with correct answers
  useEffect(() => {
    if (
      !results ||
      !results.apiQuestions ||
      results.apiQuestions.length === 0
    ) {
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
        {
          total: number;
          correct: number;
          incorrect: number;
          unanswered: number;
        }
      > = {};

      const questionStatuses: Array<{
        questionId: number;
        isCorrect: boolean;
        isUnanswered: boolean;
      }> = [];

      // Map API questions by their transformed ID (index + 1)
      results.apiQuestions!.forEach((apiQ, apiIndex) => {
        const questionId = apiIndex + 1; // Match the transformed ID
        const question = results.questions.find((q) => q.id === questionId);
        const category = question?.category || "General";

        if (!sectionStats[category]) {
          sectionStats[category] = {
            total: 0,
            correct: 0,
            incorrect: 0,
            unanswered: 0,
          };
        }
        sectionStats[category].total += 1;

        const userAnswer = results.answers[questionId];
        const correctOption = apiQ.options.find((opt) => opt.isCorrect);
        const correctAnswerId = correctOption?.id;

        let isCorrect = false;
        let isUnanswered = false;

        if (!userAnswer) {
          unanswered += 1;
          isUnanswered = true;
          sectionStats[category].unanswered += 1;
        } else if (userAnswer === correctAnswerId) {
          correct += 1;
          isCorrect = true;
          sectionStats[category].correct += 1;
        } else {
          incorrect += 1;
          sectionStats[category].incorrect += 1;
        }

        questionStatuses.push({
          questionId,
          isCorrect,
          isUnanswered,
        });
      });

      const sectionBreakdown = Object.entries(sectionStats).map(
        ([category, stats]) => ({
          category,
          total: stats.total,
          correct: stats.correct,
          incorrect: stats.incorrect,
          unanswered: stats.unanswered,
          percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        })
      );

      setGradedResults({
        correct,
        incorrect,
        unanswered,
        sectionBreakdown,
        questionStatuses,
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

  // Prepare questions with answers for detailed view
  const questionsWithAnswers = useMemo(() => {
    if (!results || !results.apiQuestions || !gradedResults) return [];

    return results.questions.map((question, index) => {
      const apiQuestion = results.apiQuestions![index];
      const userAnswerId = results.answers[question.id];
      const correctOption = apiQuestion.options.find((opt) => opt.isCorrect);
      const userOption = apiQuestion.options.find(
        (opt) => opt.id === userAnswerId
      );
      const questionStatus = gradedResults.questionStatuses.find(
        (s) => s.questionId === question.id
      );
      const isCorrect = questionStatus?.isCorrect || false;
      const isUnanswered = questionStatus?.isUnanswered || false;

      return {
        question,
        apiQuestion,
        userAnswerId,
        userOption,
        correctOption,
        isCorrect,
        isUnanswered,
      };
    });
  }, [results, gradedResults]);

  // Navigation functions
  const goTo = (idx: number) => {
    if (idx >= 0 && idx < questionsWithAnswers.length) {
      setCurrentIndex(idx);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questionsWithAnswers.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  // Show detailed one-by-one view if not showing summary
  if (!showSummary && results && gradedResults && questionsWithAnswers.length > 0) {
    return (
      <DetailedResultsView
        results={results}
        gradedResults={gradedResults}
        questionsWithAnswers={questionsWithAnswers}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        onBack={() => setShowSummary(true)}
        onGoTo={goTo}
        onNext={nextQuestion}
        onPrev={prevQuestion}
        title={examName}
        userId={user?.id || null}
      />
    );
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
              <div
                className="w-2 h-2 bg-primaryColor rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primaryColor rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primaryColor rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
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
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{examName}</h1>
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
                <span className="text-primaryText font-semibold">{examName}</span>
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
                      <span className="text-green-600">
                        ✓ {section.correct}
                      </span>
                      <span className="text-red-600">
                        ✗ {section.incorrect}
                      </span>
                      {section.unanswered > 0 && (
                        <span className="text-gray-600">
                          ○ {section.unanswered}
                        </span>
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
              onClick={() => {
                // For logged-in users, redirect to user account page (where they can see all their exam results)
                // For guest users, redirect to home page
                if (user?.id) {
                  router.push("/user-account/exam-results");
                } else {
                  router.push("/");
                }
              }}
              className="px-6 py-3 bg-primaryColor cursor-pointer text-white font-semibold rounded-md hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {user?.id ? "View All Results" : "Back to Home"}
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className="px-6 py-3 bg-secColor text-white font-semibold cursor-pointer rounded-md hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Answers
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

// Detailed Results View Component - Shows one question at a time
const DetailedResultsView: React.FC<{
  results: StoredResults;
  gradedResults: {
    correct: number;
    incorrect: number;
    unanswered: number;
    questionStatuses: Array<{
      questionId: number;
      isCorrect: boolean;
      isUnanswered: boolean;
    }>;
  };
  questionsWithAnswers: Array<{
    question: {
      id: number;
      text: string;
      category: string;
      options: Array<{ id: string; text: string }>;
    };
    apiQuestion: {
      id: string;
      question: string;
      options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>;
    };
    userAnswerId?: string;
    userOption?: { id: string; text: string; isCorrect: boolean };
    correctOption?: { id: string; text: string; isCorrect: boolean };
    isCorrect: boolean;
    isUnanswered: boolean;
  }>;
  currentIndex: number;
  totalQuestions: number;
  onBack: () => void;
  onGoTo: (idx: number) => void;
  onNext: () => void;
  onPrev: () => void;
  title: string;
  userId?: string | null;
}> = ({
  results,
  gradedResults,
  questionsWithAnswers,
  currentIndex,
  totalQuestions,
  onBack,
  onGoTo,
  onNext,
  onPrev,
  title,
  userId,
}) => {
  const router = useRouter();
  const currentItem = questionsWithAnswers[currentIndex];

  // Get status for navigation grid
  const getQuestionStatus = (questionId: number) => {
    const status = gradedResults.questionStatuses.find(
      (s) => s.questionId === questionId
    );
    if (!status) return "unanswered";
    if (status.isUnanswered) return "unanswered";
    if (status.isCorrect) return "correct";
    return "incorrect";
  };

  if (!currentItem) return null;

  const { question, apiQuestion, userOption, correctOption, isCorrect, isUnanswered } = currentItem;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primaryText">
                {title} - Review Answers
              </h1>
              <p className="text-primaryText/80 text-sm sm:text-base">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-secColor text-white font-semibold rounded-md hover:opacity-90 transition flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Summary
              </button>
              <button
                onClick={() => {
                  if (userId) {
                    router.push("/user-account/exam-results");
                  } else {
                    router.push("/");
                  }
                }}
                className="px-4 py-2 bg-primaryColor/10 text-primaryColor font-semibold rounded-md hover:bg-primaryColor/20 transition flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {userId ? "All Results" : "Home"}
              </button>
            </div>
          </div>

          {/* Question navigation grid */}
          <div className="bg-primaryCard border border-borderBg rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-4 text-sm text-primaryText mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-green-500" />
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-red-500" />
                <span>Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-gray-400" />
                <span>Unanswered</span>
              </div>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {questionsWithAnswers.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                const status = getQuestionStatus(item.question.id);

                let bg = "bg-white";
                let text = "text-primaryText";
                let border = "border-borderBg";

                if (isCurrent) {
                  bg = "bg-primaryColor text-white";
                  text = "text-white";
                  border = "border-primaryColor";
                } else if (status === "correct") {
                  bg = "bg-green-100";
                  text = "text-green-700";
                  border = "border-green-300";
                } else if (status === "incorrect") {
                  bg = "bg-red-100";
                  text = "text-red-700";
                  border = "border-red-300";
                } else {
                  bg = "bg-gray-100";
                  text = "text-gray-600";
                  border = "border-gray-300";
                }

                return (
                  <button
                    key={item.question.id}
                    onClick={() => onGoTo(idx)}
                    className={`h-9 rounded-md border-2 ${bg} ${text} ${border} text-sm font-semibold transition hover:opacity-80`}
                  >
                    {item.question.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question body */}
          <div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8 shadow-sm">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-primaryText/70">
                    Question {question.id}
                  </span>
                  <span className="text-xs px-2 py-1 bg-primaryColor/10 text-primaryColor rounded">
                    {question.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg text-primaryText leading-relaxed">
                  {question.text}
                </h3>
              </div>
              {/* Status Badge */}
              <div className="ml-4">
                {isUnanswered ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Unanswered
                  </span>
                ) : isCorrect ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <X className="w-4 h-4" />
                    Incorrect
                  </span>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mt-6">
              {apiQuestion.options.map((option) => {
                const isUserAnswer = option.id === userOption?.id;
                const isCorrectAnswer = option.id === correctOption?.id;

                let bgColor = "bg-white";
                let borderColor = "border-borderBg";
                let textColor = "text-primaryText";

                if (isCorrectAnswer && isUserAnswer) {
                  // Both correct and user selected
                  bgColor = "bg-green-50";
                  borderColor = "border-green-500";
                  textColor = "text-green-900";
                } else if (isCorrectAnswer) {
                  // Correct answer (but user didn't select it)
                  bgColor = "bg-green-50";
                  borderColor = "border-green-500";
                  textColor = "text-green-900";
                } else if (isUserAnswer) {
                  // User's answer (but incorrect)
                  bgColor = "bg-red-50";
                  borderColor = "border-red-500";
                  textColor = "text-red-900";
                }

                return (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor} transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isCorrectAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                        {!isCorrectAnswer && !isUserAnswer && (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">{option.text}</p>
                        {isCorrectAnswer && !isUserAnswer && (
                          <p className="text-xs mt-1 font-semibold text-green-700">
                            ✓ Correct Answer
                          </p>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <p className="text-xs mt-1 font-semibold text-red-700">
                            ✗ Your Answer
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between gap-3">
              <button
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-secColor text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex === questionsWithAnswers.length - 1 ? (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primaryColor text-white font-semibold hover:opacity-90 transition"
                >
                  <span>Back to Summary</span>
                  <CheckCircle className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primaryColor text-white font-semibold hover:opacity-90 transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExamResults;
