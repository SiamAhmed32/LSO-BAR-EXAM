"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { FreeQuestion } from "@/components/data/freeExamQuestions";
import { Bookmark, CheckCircle } from "lucide-react";
import ExamTimer from "./ExamTimer";
import { examApi, ApiQuestion } from "@/lib/api/examApi";
import { useUser } from "@/components/context";
import { getExamStorageKey } from "@/lib/utils/examStorage";
import FinishExamModal from "@/components/shared/FinishExamModal";

type FreeExamRunnerProps = {
  title: string;
  questions: FreeQuestion[];
  duration?: string; // e.g., "2 hours", "4 hours"
  examType?: "barrister" | "solicitor";
  // For paid exams, this is "set-a" | "set-b"; for free exams we use "free"
  examSet?: "set-a" | "set-b" | "free";
};

const FreeExamRunner: React.FC<FreeExamRunnerProps> = ({
  title,
  questions,
  duration,
  examType,
  examSet,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | undefined>>(
    {}
  );
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Use user-specific storage key
  const storageKey = useMemo(
    () => getExamStorageKey(title, user?.id || null),
    [title, user?.id]
  );

  const currentQuestion = questions[currentIndex];

  const answeredSet = useMemo(() => {
    return new Set(
      Object.entries(answers)
        .filter(([, val]) => Boolean(val))
        .map(([key]) => Number(key))
    );
  }, [answers]);

  // Hydrate from localStorage ONLY when questions are loaded and available
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't hydrate if questions are not loaded yet
    if (!questions || questions.length === 0) return;
    
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        console.log('💾 No localStorage data found for:', storageKey);
        return;
      }
      
      const parsed = JSON.parse(raw) as {
        answers?: Record<number, string>;
        bookmarked?: number[];
        currentIndex?: number;
      };
      
      console.log('💾 Loading from localStorage:', { storageKey, parsed, questionsCount: questions.length });
      
      // Restore answers
      if (parsed.answers && Object.keys(parsed.answers).length > 0) {
        setAnswers(parsed.answers);
        console.log('✅ Restored answers:', parsed.answers);
      }
      
      // Restore bookmarks
      if (parsed.bookmarked && parsed.bookmarked.length > 0) {
        const bookmarkedSet = new Set(parsed.bookmarked.filter((id) => Number.isFinite(id)));
        setBookmarked(bookmarkedSet);
        console.log('✅ Restored bookmarks:', Array.from(bookmarkedSet));
      }
      
      // Restore current index
      if (
        Number.isInteger(parsed.currentIndex) &&
        parsed.currentIndex! >= 0 &&
        parsed.currentIndex! < questions.length
      ) {
        setCurrentIndex(parsed.currentIndex!);
        console.log('✅ Restored current index:', parsed.currentIndex);
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
    }
    // Only run when questions are actually loaded (not just when length changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, questions]);

  // Persist to localStorage when state changes (only if questions are loaded)
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't save if questions are not loaded yet
    if (!questions || questions.length === 0) return;
    
    try {
      const dataToSave = {
        answers,
        bookmarked: Array.from(bookmarked),
        currentIndex,
      };
      
      window.localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log('💾 Saved to localStorage:', { storageKey, dataToSave });
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }, [answers, bookmarked, currentIndex, storageKey, questions]);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < questions.length) setCurrentIndex(idx);
  };

  const handleSelect = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const finishExam = async () => {
    setIsFinished(true);
    
    // Fetch original API questions with correct answers
    let apiQuestions: ApiQuestion[] = [];
    let examId: string | null = null;
    let examResponse: any = null;
    
    try {
      const response = await examApi.getQuestions(
        examType || "barrister",
        examSet || "set-a",
        1,
        200
      );
      apiQuestions = response.questions;
      examResponse = response;
      examId = response.exam?.id || null;
    } catch (error) {
      console.error("Failed to fetch questions for grading:", error);
    }
    
    // Calculate results
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).filter(
      (key) => answers[Number(key)] !== undefined
    ).length;
    
    // Calculate correct, incorrect, and unanswered counts
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    
    if (apiQuestions.length > 0) {
      apiQuestions.forEach((apiQ, apiIndex) => {
        const questionId = apiIndex + 1; // Match the transformed ID
        const userAnswer = answers[questionId];
        const correctOption = apiQ.options.find((opt: { id: string; text: string; isCorrect: boolean }) => opt.isCorrect);
        const correctAnswerId = correctOption?.id;
        
        if (!userAnswer) {
          unansweredCount += 1;
        } else if (userAnswer === correctAnswerId) {
          correctCount += 1;
        } else {
          incorrectCount += 1;
        }
      });
    }
    
    // Calculate score percentage
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    
    // Submit exam results to database (for both paid and free exams, if user is logged in)
    // This allows results to appear in the user's profile/dashboard
    let attemptId: string | null = null;
    if (examId && user?.id) {
      try {
        const submitResult = await examApi.submitExam({
          examId: examId,
          totalQuestions,
          answeredCount,
          correctCount,
          incorrectCount,
          unansweredCount,
          score,
          answers, // Store user answers as JSON
        });
        attemptId = submitResult.attemptId;
        console.log("✅ Exam submitted successfully to database, attemptId:", attemptId);
      } catch (error: any) {
        console.error("❌ Failed to submit exam to database:", error);
        // Don't block the flow if submission fails, but log the error
        // The user can still see their results from sessionStorage
      }
    } else if (!user?.id) {
      console.log("ℹ️ Guest user - exam results stored in sessionStorage only");
    }
    
    // Build results URL with query params
    const resultsParams = new URLSearchParams({
      examType: examType || "barrister",
      examSet: examSet || "set-a",
      total: totalQuestions.toString(),
      answered: answeredCount.toString(),
      title: title,
    });
    
    // Add attemptId if available (for logged-in users to fetch from backend)
    if (attemptId) {
      resultsParams.set("attemptId", attemptId);
    }
    
    // Store answers and correct answers in sessionStorage for results page
    // Use user-specific key to separate guest results from logged-in user results
    if (typeof window !== "undefined") {
      const userId = user?.id || null;
      const userPrefix = userId ? userId : "guest";
      const resultsKey = `exam-results-${userPrefix}-${examType}-${examSet}`;
      
      sessionStorage.setItem(
        resultsKey,
        JSON.stringify({
          finished: true, // Flag to indicate exam was properly finished
          answers,
          questions: questions.map((q) => ({
            id: q.id,
            text: q.text,
            category: q.category,
            options: q.options,
          })),
          apiQuestions, // Store original API questions with isCorrect flags
        })
      );

      // Clear persisted in-progress state so a new attempt starts fresh
      // (progress is only restored if the exam was not finished)
      try {
        window.localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("❌ Error clearing exam progress from localStorage:", error);
      }
    }
    
    router.push(`/exam-results?${resultsParams.toString()}`);
  };

  const handleTimeUp = () => {
    // Auto-finish when time runs out
    finishExam();
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primaryText">
                {title}
              </h1>
              <p className="text-primaryText/80 text-sm sm:text-base">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            {duration && (
              <ExamTimer
                duration={duration}
                onTimeUp={handleTimeUp}
                examKey={storageKey}
                isFinished={isFinished}
              />
            )}
          </div>

          {/* Question navigation */}
          <div className="bg-primaryCard border border-borderBg rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-4 text-sm text-primaryText mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-primaryColor" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-orange-500" />
                <span>Bookmarked</span>
              </div>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answeredSet.has(q.id);
                const isBookmarked = bookmarked.has(q.id);

                let bg = "bg-white";
                let text = "text-primaryText";
                if (isCurrent) {
                  bg = "bg-primaryColor text-white";
                  text = "text-white";
                } else if (isAnswered) {
                  bg = "bg-primaryColor/20";
                  text = "text-primaryText";
                }
                if (isBookmarked && !isCurrent) {
                  bg = "bg-orange-500/30";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className={`h-9 rounded-md border border-borderBg text-sm font-semibold transition ${bg} ${text}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question body */}
          <div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => toggleBookmark(currentQuestion.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-borderBg text-primaryText hover:bg-primaryColor/10 transition"
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    bookmarked.has(currentQuestion.id)
                      ? "fill-orange-500 stroke-orange-500"
                      : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {bookmarked.has(currentQuestion.id)
                    ? "Bookmarked"
                    : "Bookmark Question"}
                </span>
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs uppercase tracking-wide text-primaryText/70 font-semibold">
                Category: {currentQuestion.category}
              </p>
              <p className="text-base sm:text-lg text-primaryText leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const checked = answers[currentQuestion.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 rounded-lg border border-borderBg p-3 sm:p-4 cursor-pointer transition hover:border-primaryColor ${
                      checked ? "bg-primaryColor/10 border-primaryColor" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1 h-4 w-4"
                      checked={checked}
                      onChange={() => handleSelect(currentQuestion.id, opt.id)}
                    />
                    <span className="text-sm sm:text-base text-primaryText">
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0 || isFinished}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-secColor text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Back</span>
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={() => setShowFinishModal(true)}
                  disabled={isFinished}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primaryColor text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Finish Test</span>
                  <CheckCircle className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={isFinished}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primaryColor text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Finish Exam Confirmation Modal */}
      <FinishExamModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={() => {
          setShowFinishModal(false);
          finishExam();
        }}
      />
    </section>
  );
};

export default FreeExamRunner;
