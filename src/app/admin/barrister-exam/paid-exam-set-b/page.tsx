'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@/components/shared';
import { AdminTable, Column, AdminDialog, ExamForm, Question, AdminCustomButton, TableSkeleton, ConfirmModal, ViewQuestionModal, ExamSettingsForm } from '@/components/Admin';
import { GraduationCap, Edit, Trash2, Eye, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import { examApi, convertApiQuestionToQuestion } from '@/lib/api/examApi';

const BarristerPaidExam = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [questionToView, setQuestionToView] = useState<Question | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<any>(null);
	const [examSettings, setExamSettings] = useState<any>(null);
	const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
	const pageLimit = 10;

	const fetchQuestions = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await examApi.getQuestions('barrister', 'set-b', currentPage, pageLimit);
			const convertedQuestions = response.questions.map(convertApiQuestionToQuestion);
			setQuestions(convertedQuestions);
			setPagination(response.pagination);
			setExamSettings(response.exam);
		} catch (error) {
			console.error('Error fetching questions:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to load questions');
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, pageLimit]);

	// Fetch questions on mount and when page changes
	useEffect(() => {
		fetchQuestions();
	}, [fetchQuestions]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleCreateQuestion = () => {
		setEditingQuestion(null);
		setIsDialogOpen(true);
	};

	const handleSettings = () => {
		setIsSettingsDialogOpen(true);
	};

	const handleCloseSettingsDialog = () => {
		setIsSettingsDialogOpen(false);
	};

	const handleSubmitSettings = async (settings: any) => {
		try {
			await examApi.updateExamSettings('barrister', 'set-b', settings);
			toast.success('Exam settings updated successfully');
			setIsSettingsDialogOpen(false);
			await fetchQuestions();
		} catch (error) {
			console.error('Error updating exam settings:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to update settings');
			throw error;
		}
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingQuestion(null);
	};

	const handleSubmitQuestion = async (question: Question) => {
		try {
			if (editingQuestion) {
				// Update existing question
				await examApi.updateQuestion('barrister', 'set-b', editingQuestion.id, question);
				toast.success('Question updated successfully');
			} else {
				// Create new question
				await examApi.createQuestion('barrister', 'set-b', question);
				toast.success('Question created successfully');
			}
			setIsDialogOpen(false);
			setEditingQuestion(null);
			// Refresh questions list (stay on current page)
			await fetchQuestions();
		} catch (error) {
			console.error('Error saving question:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to save question');
		}
	};

	const handleEdit = (question: Question) => {
		setEditingQuestion(question);
		setIsDialogOpen(true);
	};

	const handleDelete = (question: Question) => {
		setQuestionToDelete(question);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!questionToDelete) return;

		try {
			setIsDeleting(true);
			await examApi.deleteQuestion('barrister', 'set-b', questionToDelete.id);
			toast.success('Question deleted successfully');
			setIsDeleteModalOpen(false);
			setQuestionToDelete(null);
			// Refresh questions list (stay on current page)
			await fetchQuestions();
		} catch (error) {
			console.error('Error deleting question:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to delete question');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCloseDeleteModal = () => {
		if (!isDeleting) {
			setIsDeleteModalOpen(false);
			setQuestionToDelete(null);
		}
	};

	const handleView = (question: Question) => {
		setQuestionToView(question);
		setIsViewModalOpen(true);
	};

	const columns: Column<Question>[] = [
		{
			key: 'question',
			header: 'Question',
			render: (item) => (
				<Box className='text-wrap break-words w-[25vw]'>
					<p className='text-sm text-gray-600'>{item.question}</p>
				</Box>
			),
		},
		{
			key: 'options',
			header: 'Options',
			render: (item) => (
				<Box className='w-[25vw] text-wrap break-words'>
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
					<span className='text-sm text-green-600 font-medium w-[25vw] text-wrap break-words'>
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
					Barrister Exam - Paid Set B
				</h1>
				<p className='text-gray-600 mb-4'>
					Manage Barrister Paid Exam Set B questions
				</p>
				
				{/* Exam Settings Display */}
				<Box className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
					<h3 className='text-lg font-semibold text-blue-900 mb-4'>Exam Information</h3>
					<Box className='overflow-x-auto'>
						<table className='w-full border-collapse'>
							<thead>
								<tr className='border-b border-blue-300'>
									<th className='text-left py-2 px-4 font-semibold text-blue-900'>Question Count</th>
									<th className='text-left py-2 px-4 font-semibold text-blue-900'>Price</th>
									<th className='text-left py-2 px-4 font-semibold text-blue-900'>Duration</th>
									<th className='text-left py-2 px-4 font-semibold text-blue-900'>Attempt Count</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='py-2 px-4 text-blue-700'>
										{examSettings?.questionCount !== undefined ? examSettings.questionCount : 'N/A'}
									</td>
									<td className='py-2 px-4 text-blue-700'>
										{examSettings?.price ? `$${examSettings.price.toFixed(2)}` : 'Not set'}
									</td>
									<td className='py-2 px-4 text-blue-700'>
										{examSettings?.examTime || 'Not set'}
									</td>
									<td className='py-2 px-4 text-blue-700'>
										{examSettings?.attemptCount !== undefined ? examSettings.attemptCount : 'Not set'}
									</td>
								</tr>
							</tbody>
						</table>
					</Box>
				</Box>
			</Box>

			{isLoading ? (
				<TableSkeleton columns={columns.length} rows={5} />
			) : (
				<>
					<Box className='mb-4 flex justify-end'>
						<AdminCustomButton
							onClick={handleSettings}
							variant='secondary'
							className='flex items-center gap-2'
						>
							<Settings className='w-4 h-4' />
							Exam Settings
						</AdminCustomButton>
					</Box>
					<AdminTable
						data={questions}
						columns={columns}
						onCreate={handleCreateQuestion}
						createButtonText='Create Question'
						emptyMessage='No questions available. Create your first question to get started.'
						pagination={pagination}
						onPageChange={handlePageChange}
						fixedHeight={true}
						tableHeight='600px'
					/>
				</>
			)}

			{/* Create/Edit Question Dialog */}
			<AdminDialog
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
				title={editingQuestion ? 'Edit Question' : 'Create New Question'}
				size='lg'
			>
				<ExamForm
					onSubmit={handleSubmitQuestion}
					onCancel={handleCloseDialog}
					initialData={editingQuestion || undefined}
				/>
			</AdminDialog>

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDelete}
				title='Delete Question'
				message={`Are you sure you want to delete this question? This action cannot be undone.${
					questionToDelete
						? `\n\n"${questionToDelete.question.substring(0, 100)}${questionToDelete.question.length > 100 ? '...' : ''}"`
						: ''
				}`}
				confirmText='Delete'
				cancelText='Cancel'
				variant='danger'
				isLoading={isDeleting}
			/>

			{/* View Question Modal */}
			<ViewQuestionModal
				isOpen={isViewModalOpen}
				onClose={() => {
					setIsViewModalOpen(false);
					setQuestionToView(null);
				}}
				question={questionToView}
			/>

			{/* Exam Settings Dialog */}
			<AdminDialog
				isOpen={isSettingsDialogOpen}
				onClose={handleCloseSettingsDialog}
				title='Exam Settings'
				size='lg'
			>
				<ExamSettingsForm
					initialData={{
						title: examSettings?.title || '',
						description: examSettings?.description || '',
						price: examSettings?.price || 0,
						examTime: examSettings?.examTime || '',
						attemptCount: examSettings?.attemptCount || undefined,
					}}
					onSubmit={handleSubmitSettings}
					onCancel={handleCloseSettingsDialog}
					examType='BARRISTER'
					examSet='SET_B'
				/>
			</AdminDialog>
		</Box>
	);
};

export default BarristerPaidExam;

