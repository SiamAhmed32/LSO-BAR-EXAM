import React from 'react';
import FreeExamPage from '@/components/shared/FreeExamPage';

type Props = {};

const BarristerFreePage = (props: Props) => {
  return (
		<FreeExamPage
			examType="barrister"
			examTitle="Barrister Sample Exam"
		/>
	);
};

export default BarristerFreePage;