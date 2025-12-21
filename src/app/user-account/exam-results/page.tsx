"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components";
import Container from "@/components/shared/Container";
import AccountSidebar from "@/components/UserAccSection/AccountSidebar";
import { FileText, Calendar, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import ExamResultDetailsModal from "@/components/shared/ExamResultDetailsModal";

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
}

const UserExamResultsPage = () => {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);

  const fetchAttempts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/exams/attempts?page=${currentPage}&limit=10`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exam attempts");
      }

      const data = await response.json();
      setAttempts(data.data.attempts);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Error fetching exam attempts:", error);
      toast.error("Failed to load exam attempts");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

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
    if (exam.title) return exam.title;
    const type = exam.examType === "BARRISTER" ? "Barrister" : "Solicitor";
    const set = exam.examSet === "SET_A" ? "Set A" : exam.examSet === "SET_B" ? "Set B" : "";
    return `${type} ${set}`.trim();
  };

  return (
    <Layout>
      <section className="pt-24 pb-12 lg:pt-28 lg:pb-16 bg-primaryBg min-h-screen">
        <Container>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <AccountSidebar />

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm">
                <div className="p-6 border-b border-borderBg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primaryColor" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-primaryText">
                      Exam Results
                    </h1>
                  </div>
                </div>

                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader size="lg" />
                    </div>
                  ) : attempts.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-primaryText/70 mb-2">
                        No exam attempts found
                      </p>
                      <p className="text-sm text-primaryText/50">
                        Your exam results will appear here once you complete an exam.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {attempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="border border-borderBg rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedAttempt(attempt);
                            setIsModalOpen(true);
                          }}
                        >
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-primaryText mb-1">
                                {getExamName(attempt.exam)}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-primaryText/70">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(attempt.submittedAt)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className={`px-4 py-2 rounded-lg ${getScoreBgColor(
                                  attempt.score
                                )} ${getScoreColor(attempt.score)}`}
                              >
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-5 h-5" />
                                  <span className="text-xl font-bold">
                                    {attempt.score.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-primaryText/70">Correct</span>
                              </div>
                              <p className="text-lg font-semibold text-primaryText">
                                {attempt.correctCount}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-xs text-primaryText/70">Incorrect</span>
                              </div>
                              <p className="text-lg font-semibold text-primaryText">
                                {attempt.incorrectCount}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-xs text-primaryText/70">Unanswered</span>
                              </div>
                              <p className="text-lg font-semibold text-primaryText">
                                {attempt.unansweredCount}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-xs text-primaryText/70">Total</span>
                              </div>
                              <p className="text-lg font-semibold text-primaryText">
                                {attempt.totalQuestions}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pagination */}
                      {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={!pagination.hasPrevPage}
                            className="px-4 py-2 border border-borderBg rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2 text-sm text-primaryText">
                            Page {pagination.page} of {pagination.totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((p) =>
                                Math.min(pagination.totalPages, p + 1)
                              )
                            }
                            disabled={!pagination.hasNextPage}
                            className="px-4 py-2 border border-borderBg rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Exam Result Details Modal */}
      <ExamResultDetailsModal
        attempt={selectedAttempt}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAttempt(null);
        }}
        showUserInfo={false}
      />
    </Layout>
  );
};

export default UserExamResultsPage;

