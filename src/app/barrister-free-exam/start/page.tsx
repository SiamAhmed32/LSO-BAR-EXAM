"use client";

import React, { useMemo } from 'react';
import { Layout } from '@/components';
import FreeExamRunner from '@/components/ExamRunner/FreeExamRunner';
import { useGetBarristerFreeQuestionsQuery } from '@/store/services/examApi';
import { transformApiQuestionsToFreeQuestions } from '@/lib/utils/examTransform';
import ExamLoader from '@/components/shared/ExamLoader';
import ExamError from '@/components/shared/ExamError';
import ExamEmpty from '@/components/shared/ExamEmpty';

const Page = () => {
	const { data, isLoading, error, refetch } = useGetBarristerFreeQuestionsQuery(undefined, {
		// Use cached data if available, don't refetch on mount/refresh
		refetchOnMountOrArgChange: false,
		refetchOnFocus: false,
		refetchOnReconnect: false,
	});

	const questions = useMemo(() => {
		if (!data?.questions) return [];
		console.log('🔄 Barrister Free Exam - Transformed Questions:', data.questions);
		return transformApiQuestionsToFreeQuestions(data.questions);
	}, [data]);

	if (isLoading) {
		return (
			<Layout>
				<ExamLoader examType="Barrister" />
			</Layout>
		);
	}

	if (error) {
		console.error('❌ Barrister Free Exam - Error:', error);
		return (
			<Layout>
				<ExamError examType="Barrister" onRetry={() => refetch()} />
			</Layout>
		);
	}

	if (!questions || questions.length === 0) {
		return (
			<Layout>
				<ExamEmpty examType="Barrister" />
			</Layout>
		);
	}

	console.log('✅ Barrister Free Exam - Final Questions Count:', questions.length);
	console.log('✅ Barrister Free Exam - Final Questions:', questions);

	return (
		<Layout>
			<FreeExamRunner
				title="Barrister Free Exam"
				questions={questions}
				examType="barrister"
				examSet="free"
			/>
		</Layout>
	);
};

export default Page;

