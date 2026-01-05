import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { QuestionsResponse, ApiResponse } from '@/lib/api/examApi';

const tags = ['exam', 'questions'];

export interface RootState {
	auth: {
		token: string | null;
	};
}

export const examApi = createApi({
	reducerPath: 'examApi',
	baseQuery: fetchBaseQuery({
		baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
	}),
	tagTypes: tags,
	endpoints: (builder) => ({
		// Get all questions for barrister free exam
		getBarristerFreeQuestions: builder.query<QuestionsResponse, void>({
			query: () => ({
				url: '/api/exams/barrister/free',
				params: {
					page: 1,
					limit: 9999, // Fetch all questions
				},
			}),
			transformResponse: (response: ApiResponse<QuestionsResponse>) => {
				return response.data;
			},
			providesTags: ['questions'],
			keepUnusedDataFor: 60 * 60 * 24, // Cache for 24 hours - prevents refetch on refresh
		}),

		// Get all questions for solicitor free exam
		getSolicitorFreeQuestions: builder.query<QuestionsResponse, void>({
			query: () => ({
				url: '/api/exams/solicitor/free',
				params: {
					page: 1,
					limit: 9999, // Fetch all questions
				},
			}),
			transformResponse: (response: ApiResponse<QuestionsResponse>) => {
			return response.data;
			},
			providesTags: ['questions'],
			keepUnusedDataFor: 60 * 60 * 24, // Cache for 24 hours - prevents refetch on refresh
		}),
	}),
});

export const {
	useGetBarristerFreeQuestionsQuery,
	useGetSolicitorFreeQuestionsQuery,
} = examApi;

export default examApi;

