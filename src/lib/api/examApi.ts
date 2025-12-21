import { Question } from '@/components/Admin';

export interface ApiQuestion {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface QuestionsResponse {
  exam: {
    id: string;
    examType: string;
    pricingType: string;
    title: string | null;
    description: string | null;
    price: number | null;
    examTime: string | null; // Duration string like "4 hours", "2 hours", "30 minutes"
  };
  questions: ApiQuestion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Convert API question format to component Question format
export const convertApiQuestionToQuestion = (apiQuestion: ApiQuestion): Question => {
  return {
    id: apiQuestion.id,
    question: apiQuestion.question,
    options: apiQuestion.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      isCorrect: opt.isCorrect,
    })),
  };
};

// Convert component Question format to API format
export const convertQuestionToApiFormat = (question: Question) => {
  return {
    question: question.question,
    options: question.options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.isCorrect,
    })),
  };
};

// Helper function to build API path
const buildApiPath = (
  examType: 'barrister' | 'solicitor',
  pricingType: 'free' | 'paid' | 'set-a' | 'set-b'
): string => {
  if (pricingType === 'set-a') {
    return `/api/exams/${examType}/paid`;
  }
  if (pricingType === 'set-b') {
    return `/api/exams/${examType}/paid/set-b`;
  }
  return `/api/exams/${examType}/${pricingType}`;
};

// Exam API functions
export const examApi = {
  // Get all questions
  async getQuestions(
    examType: 'barrister' | 'solicitor',
    pricingType: 'free' | 'paid' | 'set-a' | 'set-b',
    page: number = 1,
    limit: number = 100
  ): Promise<QuestionsResponse> {
    const path = buildApiPath(examType, pricingType);
    const response = await fetch(
      `${path}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch questions');
    }

    return response.json().then((data) => data.data);
  },

  // Get single question
  async getQuestion(
    examType: 'barrister' | 'solicitor',
    pricingType: 'free' | 'paid' | 'set-a' | 'set-b',
    questionId: string
  ): Promise<ApiQuestion> {
    const path = buildApiPath(examType, pricingType);
    const response = await fetch(
      `${path}/${questionId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch question');
    }

    return response.json().then((data) => data.data);
  },

  // Create question
  async createQuestion(
    examType: 'barrister' | 'solicitor',
    pricingType: 'free' | 'paid' | 'set-a' | 'set-b',
    question: Question
  ): Promise<ApiQuestion> {
    const payload = convertQuestionToApiFormat(question);
    const path = buildApiPath(examType, pricingType);

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create question');
    }

    return response.json().then((data) => data.data);
  },

  // Update question
  async updateQuestion(
    examType: 'barrister' | 'solicitor',
    pricingType: 'free' | 'paid' | 'set-a' | 'set-b',
    questionId: string,
    question: Question
  ): Promise<ApiQuestion> {
    const payload = convertQuestionToApiFormat(question);
    const path = buildApiPath(examType, pricingType);

    const response = await fetch(
      `${path}/${questionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update question');
    }

    return response.json().then((data) => data.data);
  },

  // Delete question
  async deleteQuestion(
    examType: 'barrister' | 'solicitor',
    pricingType: 'free' | 'paid' | 'set-a' | 'set-b',
    questionId: string
  ): Promise<void> {
    const path = buildApiPath(examType, pricingType);
    const response = await fetch(
      `${path}/${questionId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete question');
    }
  },

  // Update exam settings
  async updateExamSettings(
    examType: 'barrister' | 'solicitor',
    pricingType: 'free' | 'paid' | 'set-a' | 'set-b',
    settings: {
      title?: string;
      description?: string;
      price?: number;
      examTime?: string;
      attemptCount?: number;
    }
  ): Promise<void> {
    const path = buildApiPath(examType, pricingType);
    
    const response = await fetch(path, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update exam settings');
    }
  },

  // Get exam metadata (id, price, duration, questionCount, attemptCount) - Public endpoint, no auth required
  async getExamMetadata(): Promise<Record<string, { id: string; price: number; examTime: string; questionCount: number; attemptCount: number | null }>> {
    const response = await fetch('/api/exams/metadata', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch exam metadata');
    }

    const result = await response.json();
    return result.data;
  },

  // Get list of purchased exam IDs (frontend IDs like "barrister-set-a")
  // Returns array of frontend IDs for backward compatibility
  async getPurchasedExams(): Promise<string[]> {
    const detailed = await this.getPurchasedExamsDetailed();
    console.log("Detailed purchased exams:", detailed);
    const frontendIds = detailed.map((exam) => exam.frontendId);
    console.log("Frontend IDs extracted:", frontendIds);
    return frontendIds;
  },

  // Get detailed purchased exams with attempt information
  async getPurchasedExamsDetailed(): Promise<Array<{
    frontendId: string;
    examId: string;
    examType: string;
    examSet: string;
    totalAttempts: number | null;
    usedAttempts: number;
    remainingAttempts: number | null;
    purchasedAt: string | null;
  }>> {
    const response = await fetch('/api/exams/purchased', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch purchased exams');
    }

    const result = await response.json();
    return result.data || [];
  },

  // Submit exam results
  async submitExam(data: {
    examId: string;
    totalQuestions: number;
    answeredCount: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    score: number;
    answers: Record<string, any>;
  }): Promise<{ attemptId: string; remainingAttempts: number | null }> {
    const response = await fetch('/api/exams/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit exam');
    }

    const result = await response.json();
    return result.data;
  },
};

