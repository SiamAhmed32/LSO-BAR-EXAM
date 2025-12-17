import { ApiQuestion } from '@/lib/api/examApi';
import { FreeQuestion } from '@/components/data/freeExamQuestions';

/**
 * Transform API question format to FreeQuestion format
 */
export const transformApiQuestionToFreeQuestion = (
  apiQuestion: ApiQuestion,
  index: number
): FreeQuestion => {
  return {
    id: index + 1, // Convert to number starting from 1
    category: 'General', // Default category, can be updated if API provides it
    text: apiQuestion.question,
    options: apiQuestion.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  };
};

/**
 * Transform array of API questions to FreeQuestion array
 */
export const transformApiQuestionsToFreeQuestions = (
  apiQuestions: ApiQuestion[]
): FreeQuestion[] => {
  return apiQuestions.map((q, index) => transformApiQuestionToFreeQuestion(q, index));
};

/**
 * Get correct answer ID for a question
 */
export const getCorrectAnswerId = (apiQuestion: ApiQuestion): string | null => {
  const correctOption = apiQuestion.options.find((opt) => opt.isCorrect);
  return correctOption?.id || null;
};

