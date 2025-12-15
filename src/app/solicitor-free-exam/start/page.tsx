import React from 'react';
import { Layout } from '@/components';
import FreeExamRunner from '@/components/ExamRunner/FreeExamRunner';
import { solicitorFreeQuestions } from '@/components/data/freeExamQuestions';

const Page = () => {
	return (
		<Layout>
			<FreeExamRunner title="Solicitor Free Exam" questions={solicitorFreeQuestions} />
		</Layout>
	);
};

export default Page;

