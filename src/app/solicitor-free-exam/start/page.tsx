"use client";

import React, { useMemo } from 'react';
import { Layout } from '@/components';
import FreeExamRunner from '@/components/ExamRunner/FreeExamRunner';
import { useGetSolicitorFreeQuestionsQuery } from '@/store/services/examApi';
import { transformApiQuestionsToFreeQuestions } from '@/lib/utils/examTransform';
import ExamLoader from '@/components/shared/ExamLoader';
import ExamError from '@/components/shared/ExamError';
import ExamEmpty from '@/components/shared/ExamEmpty';

const Page = () => {
	const { data, isLoading, error, refetch } = useGetSolicitorFreeQuestionsQuery(undefined, {
		// Use cached data if available, don't refetch on mount/refresh
		refetchOnMountOrArgChange: false,
		refetchOnFocus: false,
		refetchOnReconnect: false,
	});

	const questions = useMemo(() => {
		if (!data?.questions) return [];
		console.log('🔄 Solicitor Free Exam - Transformed Questions:', data.questions);
		return transformApiQuestionsToFreeQuestions(data.questions);
	}, [data]);

	if (isLoading) {
		return (
			<Layout>
				<ExamLoader examType="Solicitor" />
			</Layout>
		);
	}

	if (error) {
		console.error('❌ Solicitor Free Exam - Error:', error);
		return (
			<Layout>
				<ExamError examType="Solicitor" onRetry={() => refetch()} />
			</Layout>
		);
	}

	if (!questions || questions.length === 0) {
		return (
			<Layout>
				<ExamEmpty examType="Solicitor" />
			</Layout>
		);
	}

	console.log('✅ Solicitor Free Exam - Final Questions Count:', questions.length);
	console.log('✅ Solicitor Free Exam - Final Questions:', questions);

	return (
		<Layout>
			<FreeExamRunner title="Solicitor Free Exam" questions={questions} />
		</Layout>
	);
};

export default Page;

