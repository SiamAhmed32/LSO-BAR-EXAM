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

// Exam API functions
export const examApi = {
  // Get all questions
  async getQuestions(
    examType: 'barrister' | 'solicitor',
    pricingType: 'free' | 'paid',
    page: number = 1,
    limit: number = 100
  ): Promise<QuestionsResponse> {
    const response = await fetch(
      `/api/exams/${examType}/${pricingType}?page=${page}&limit=${limit}`,
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
    pricingType: 'free' | 'paid',
    questionId: string
  ): Promise<ApiQuestion> {
    const response = await fetch(
      `/api/exams/${examType}/${pricingType}/${questionId}`,
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
    pricingType: 'free' | 'paid',
    question: Question
  ): Promise<ApiQuestion> {
    const payload = convertQuestionToApiFormat(question);

    const response = await fetch(`/api/exams/${examType}/${pricingType}`, {
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
    pricingType: 'free' | 'paid',
    questionId: string,
    question: Question
  ): Promise<ApiQuestion> {
    const payload = convertQuestionToApiFormat(question);

    const response = await fetch(
      `/api/exams/${examType}/${pricingType}/${questionId}`,
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
    pricingType: 'free' | 'paid',
    questionId: string
  ): Promise<void> {
    const response = await fetch(
      `/api/exams/${examType}/${pricingType}/${questionId}`,
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
};

