'use client';

import React, { useState } from 'react';
import { Box } from '@/components/ui';
import { AdminTable, Column, AdminDialog, ExamForm, Question, AdminCustomButton } from '@/components/Admin';
import { GraduationCap, Edit, Trash2, Eye } from 'lucide-react';

const BarristerFreeExam = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [questions, setQuestions] = useState<Question[]>([
		{
			id: '1',
			question: 'What is the primary role of a barrister in the legal system?',
			options: [
				{ id: '1-1', text: 'To provide legal advice to clients', isCorrect: false },
				{ id: '1-2', text: 'To represent clients in court', isCorrect: true },
				{ id: '1-3', text: 'To draft legal documents', isCorrect: false },
				{ id: '1-4', text: 'To manage law firms', isCorrect: false },
			],
		},
		{
			id: '2',
			question: 'Which court does a barrister typically appear in?',
			options: [
				{ id: '2-1', text: 'Magistrates Court', isCorrect: false },
				{ id: '2-2', text: 'High Court', isCorrect: true },
				{ id: '2-3', text: 'County Court', isCorrect: false },
				{ id: '2-4', text: 'All of the above', isCorrect: false },
			],
		},
	]);

	const handleCreateQuestion = () => {
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	const handleSubmitQuestion = (question: Question) => {
		setQuestions([...questions, question]);
		setIsDialogOpen(false);
	};

	const handleEdit = (question: Question) => {
		console.log('Edit question:', question.id);
		// You can open the dialog with initial data for editing
	};

	const handleDelete = (question: Question) => {
		if (confirm(`Are you sure you want to delete this question?`)) {
			setQuestions(questions.filter((q) => q.id !== question.id));
		}
	};

	const handleView = (question: Question) => {
		console.log('View question:', question.id);
	};

	const columns: Column<Question>[] = [
		{
			key: 'question',
			header: 'Question',
			className: 'max-w-md',
		},
		{
			key: 'options',
			header: 'Options',
			render: (item) => (
				<Box>
					<p className='text-sm text-gray-600'>{item.options.length} options</p>
					<Box className='mt-1 space-y-1'>
						{item.options.map((opt, idx) => (
							<p
								key={opt.id}
								className={`text-xs ${
									opt.isCorrect
										? 'text-green-600 font-medium'
										: 'text-gray-500'
								}`}
							>
								{idx + 1}. {opt.text}
								{opt.isCorrect && ' ✓'}
							</p>
						))}
					</Box>
				</Box>
			),
		},
		{
			key: 'correctAnswer',
			header: 'Correct Answer',
			render: (item) => {
				const correctOption = item.options.find((opt) => opt.isCorrect);
				return (
					<span className='text-sm text-green-600 font-medium'>
						{correctOption?.text || 'Not set'}
					</span>
				);
			},
		},
		{
			key: 'actions',
			header: 'Actions',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					<AdminCustomButton
						onClick={() => handleView(item)}
						variant='icon'
						className='text-blue-600 hover:bg-blue-50'
						title='View'
					>
						<Eye className='w-4 h-4' />
					</AdminCustomButton>
					<AdminCustomButton
						onClick={() => handleEdit(item)}
						variant='icon'
						className='text-green-600 hover:bg-green-50'
						title='Edit'
					>
						<Edit className='w-4 h-4' />
					</AdminCustomButton>
					<AdminCustomButton
						onClick={() => handleDelete(item)}
						variant='icon'
						className='text-red-600 hover:bg-red-50'
						title='Delete'
					>
						<Trash2 className='w-4 h-4' />
					</AdminCustomButton>
				</Box>
			),
		},
	];

	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<GraduationCap className='w-8 h-8' />
					Barrister Exam - Free Exams
				</h1>
				<p className='text-gray-600'>
					Manage free barrister exam tests and questions
				</p>
			</Box>

			<AdminTable
				data={questions}
				columns={columns}
				onCreate={handleCreateQuestion}
				createButtonText='Create Question'
				emptyMessage='No questions available. Create your first question to get started.'
			/>

			{/* Create Question Dialog */}
			<AdminDialog
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
				title='Create New Question'
				size='lg'
			>
				<ExamForm onSubmit={handleSubmitQuestion} onCancel={handleCloseDialog} />
			</AdminDialog>
		</Box>
	);
};

export default BarristerFreeExam;

