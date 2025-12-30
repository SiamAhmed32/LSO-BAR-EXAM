"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@/components/shared";
import {
  AdminTable,
  Column,
  TableSkeleton,
} from "@/components/Admin";
import { FileText, Search, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

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
  user: User;
  exam: Exam;
}

const AdminExamResultsPage = () => {
  const router = useRouter();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stats, setStats] = useState<any>(null);

  const fetchAttempts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/exam-attempts?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exam attempts");
      }

      const data = await response.json();
      setAttempts(data.data.attempts);
      setPagination(data.data.pagination);
      setStats(data.data.stats);
    } catch (error) {
      console.error("Error fetching exam attempts:", error);
      toast.error("Failed to load exam attempts");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const handleViewResults = (attempt: ExamAttempt) => {
    // Redirect to exam results page with attemptId
    // The ExamResults component will fetch from backend using attemptId
    const params = new URLSearchParams({
      attemptId: attempt.id,
      examType: attempt.exam.examType.toLowerCase(),
      examSet: attempt.exam.examSet 
        ? attempt.exam.examSet.toLowerCase().replace('_', '-')
        : 'set-a',
      total: attempt.totalQuestions.toString(),
      answered: attempt.answeredCount.toString(),
      title: getExamName(attempt.exam),
    });
    
    router.push(`/exam-results?${params.toString()}`);
  };

  const columns: Column<ExamAttempt>[] = [
    {
      key: "user",
      header: "User",
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-primaryText">{item.user.name}</p>
          <p className="text-xs text-primaryText/70">{item.user.email}</p>
        </div>
      ),
    },
    {
      key: "exam",
      header: "Exam",
      render: (item) => (
        <span className="text-sm text-primaryText">{getExamName(item.exam)}</span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(item.score)}`}
        >
          {item.score.toFixed(1)}%
        </span>
      ),
    },
    {
      key: "results",
      header: "Results",
      render: (item) => (
        <div className="text-xs text-primaryText/70">
          <p>
            ✓ {item.correctCount} / ✗ {item.incorrectCount} / ○ {item.unansweredCount}
          </p>
          <p className="text-primaryText/50">
            {item.answeredCount} of {item.totalQuestions} answered
          </p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Submitted",
      render: (item) => (
        <span className="text-sm text-primaryText/70">{formatDate(item.submittedAt)}</span>
      ),
    },
  ];

  return (
    <Box className="p-6">
      <Box className="mb-8">
        <h1 className="text-3xl font-bold text-primaryText mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Exam Results
        </h1>
        <p className="text-gray-600 mb-4">View and manage all exam submissions</p>

        {/* Stats */}
        {stats && (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Box className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">Total Attempts</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalAttempts}</p>
            </Box>
            <Box className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">Average Score</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.averageScore.toFixed(1)}%
              </p>
            </Box>
          </Box>
        )}

        {/* Search */}
        <Box className="flex flex-col sm:flex-row gap-4 mb-4">
          <Box className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user email or name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-borderBg rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          </Box>
        </Box>
      </Box>

      {isLoading ? (
        <TableSkeleton columns={columns.length} rows={5} />
      ) : (
        <AdminTable
          data={attempts}
          columns={columns}
          emptyMessage="No exam attempts found"
          pagination={pagination}
          onPageChange={handlePageChange}
          fixedHeight={true}
          tableHeight="600px"
          onRowClick={(attempt) => handleViewResults(attempt)}
        />
      )}
    </Box>
  );
};

export default AdminExamResultsPage;

