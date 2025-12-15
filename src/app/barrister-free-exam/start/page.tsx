import React from 'react';
import { Layout } from '@/components';
import FreeExamRunner from '@/components/ExamRunner/FreeExamRunner';
import { barristerFreeQuestions } from '@/components/data/freeExamQuestions';

const Page = () => {
	return (
		<Layout>
			<FreeExamRunner title="Barrister Free Exam" questions={barristerFreeQuestions} />
		</Layout>
	);
};

export default Page;

