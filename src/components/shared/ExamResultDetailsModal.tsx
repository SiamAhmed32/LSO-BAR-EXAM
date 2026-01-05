"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@/components/shared";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import AdminCustomButton from "@/components/Admin/AdminCustomButton";
import {
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Exam {
  id: string;
  examType: string;
  examSet: string | null;
  title: string | null;
  pricingType: string;
}

interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
  submittedAt: string;
  exam: Exam;
  user?: User; // Optional, for admin view
}

interface ExamResultDetailsModalProps {
  attempt: ExamAttempt | null;
  isOpen: boolean;
  onClose: () => void;
  showUserInfo?: boolean; // For admin view
}

interface QuestionWithAnswer {
  id: string;
  questionNumber: number;
  question: string;
  explanation?: string | null;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    isUserSelected: boolean;
  }>;
  userAnswerId: string | null;
  correctAnswerId: string | null;
  isCorrect: boolean;
}

const ExamResultDetailsModal: React.FC<ExamResultDetailsModalProps> = ({
  attempt,
  isOpen,
  onClose,
  showUserInfo = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      // Reset questions when modal opens
      setQuestions([]);
      setShowQuestions(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      // Re-enable body scroll when modal closes
      document.body.style.overflow = "unset";
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }

    // Cleanup: ensure body scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fetch detailed questions when user clicks to view questions
  const fetchQuestions = async () => {
    if (!attempt) return;

    // Toggle visibility
    if (showQuestions) {
      setShowQuestions(false);
      return;
    }

    // If questions already loaded, just show them
    if (questions.length > 0) {
      setShowQuestions(true);
      return;
    }

    // Fetch questions from API
    setIsLoadingQuestions(true);
    try {
      const response = await fetch(`/api/exams/attempts/${attempt.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exam questions");
      }

      const data = await response.json();
      setQuestions(data.data.questions || []);
      setShowQuestions(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExamName = (exam: Exam) => {
    // Always generate name from examType and examSet (ignore title field)
    // This ensures consistent naming based on backend data
    const type = exam.examType === "BARRISTER" ? "Barrister" : "Solicitor";
    const set = exam.examSet === "SET_A" ? "Set A" : exam.examSet === "SET_B" ? "Set B" : "";
    return `${type} ${set}`.trim();
  };

  if (!shouldRender || !attempt) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      >
        {/* Dialog */}
        <Box
          className={cn(
            "bg-primaryCard rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300",
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-primaryText">
              <FileText className="w-6 h-6 text-primaryColor" />
              Exam Result Details
            </h2>
            <AdminCustomButton
              onClick={onClose}
              variant="icon"
              className="text-gray-400 hover:text-primaryText"
            >
              <X className="w-5 h-5" />
            </AdminCustomButton>
          </Box>

          {/* Content */}
          <Box 
            className="p-6 overflow-y-auto flex-1"
            onWheel={(e) => {
              // Prevent scroll from propagating to body when at top/bottom of modal
              const element = e.currentTarget;
              const isAtTop = element.scrollTop === 0;
              const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
              
              if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                e.stopPropagation();
              }
            }}
          >
            <div className="space-y-6">
              {/* Exam Header */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-primaryColor" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getExamName(attempt.exam)}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(attempt.submittedAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <div
                      className={`px-4 py-2 rounded-lg ${getScoreBgColor(
                        attempt.score
                      )} ${getScoreColor(attempt.score)}`}
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-2xl font-bold">{attempt.score.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information (Admin Only) */}
              {showUserInfo && attempt.user && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" /> User Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-900">{attempt.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-gray-900">{attempt.user.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Results Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Correct</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{attempt.correctCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {attempt.totalQuestions > 0
                        ? ((attempt.correctCount / attempt.totalQuestions) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-600">Incorrect</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{attempt.incorrectCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {attempt.totalQuestions > 0
                        ? ((attempt.incorrectCount / attempt.totalQuestions) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-600">Unanswered</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{attempt.unansweredCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {attempt.totalQuestions > 0
                        ? ((attempt.unansweredCount / attempt.totalQuestions) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{attempt.totalQuestions}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {attempt.answeredCount} answered
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Attempt ID:</span>{" "}
                    <span className="font-mono text-xs">{attempt.id}</span>
                  </p>
                  <p>
                    <span className="font-medium">Answered:</span> {attempt.answeredCount} of{" "}
                    {attempt.totalQuestions} questions
                  </p>
                  <p>
                    <span className="font-medium">Completion Rate:</span>{" "}
                    {attempt.totalQuestions > 0
                      ? ((attempt.answeredCount / attempt.totalQuestions) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>

              {/* View Questions Button */}
              <div className="flex justify-center">
                <button
                  onClick={fetchQuestions}
                  disabled={isLoadingQuestions}
                  className="px-6 py-3 bg-primaryColor text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingQuestions ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading Questions...
                    </>
                  ) : showQuestions ? (
                    "Hide Questions & Answers"
                  ) : (
                    "View Questions & Answers"
                  )}
                </button>
              </div>

              {/* Questions and Answers Section */}
              {showQuestions && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Questions & Answers
                  </h3>
                  {isLoadingQuestions ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : questions.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No questions found</p>
                  ) : (
                    <div className="space-y-6">
                      {questions.map((question) => (
                        <div
                          key={question.id}
                          className="bg-white rounded-lg p-4 border-2 border-gray-200"
                        >
                          {/* Question Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                Question {question.questionNumber}
                              </span>
                              {question.isCorrect ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Correct
                                </span>
                              ) : question.userAnswerId ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  Incorrect
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Unanswered
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Question Text */}
                          <p className="text-gray-900 font-medium mb-4">{question.question}</p>

                          {/* Options */}
                          <div className="space-y-2">
                            {question.options.map((option) => {
                              const isUserAnswer = option.isUserSelected;
                              const isCorrectAnswer = option.isCorrect;
                              let optionClass = "p-3 rounded-lg border-2 transition-all";
                              
                              if (isCorrectAnswer) {
                                optionClass += " bg-green-50 border-green-500";
                              } else if (isUserAnswer && !isCorrectAnswer) {
                                optionClass += " bg-red-50 border-red-500";
                              } else {
                                optionClass += " bg-gray-50 border-gray-200";
                              }

                              return (
                                <div key={option.id} className={optionClass}>
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                      style={{
                                        borderColor: isCorrectAnswer 
                                          ? "#10b981" 
                                          : isUserAnswer 
                                          ? "#ef4444" 
                                          : "#e5e7eb",
                                        backgroundColor: isCorrectAnswer 
                                          ? "#10b981" 
                                          : isUserAnswer 
                                          ? "#ef4444" 
                                          : "transparent"
                                      }}
                                    >
                                      {isCorrectAnswer && (
                                        <CheckCircle className="w-3 h-3 text-white" />
                                      )}
                                      {isUserAnswer && !isCorrectAnswer && (
                                        <XCircle className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                    <span className="text-gray-900 flex-1">{option.text}</span>
                                    {isCorrectAnswer && (
                                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                                        Correct Answer
                                      </span>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
                                        Your Answer
                                      </span>
                                    )}
                                    {isUserAnswer && isCorrectAnswer && (
                                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                                        Your Answer (Correct)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation - Show if answer is wrong or unanswered */}
                          {(!question.isCorrect || !question.userAnswerId) && question.explanation && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Explanation</h4>
                                  <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                                    {question.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default ExamResultDetailsModal;

