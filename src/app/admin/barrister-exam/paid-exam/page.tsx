'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@/components/shared';
import { AdminTable, Column, AdminDialog, ExamForm, Question, AdminCustomButton, TableSkeleton, ConfirmModal, ViewQuestionModal } from '@/components/Admin';
import { GraduationCap, Edit, Trash2, Eye } from 'lucide-react';
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
	const pageLimit = 10;

	const fetchQuestions = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await examApi.getQuestions('barrister', 'paid', currentPage, pageLimit);
			const convertedQuestions = response.questions.map(convertApiQuestionToQuestion);
			setQuestions(convertedQuestions);
			setPagination(response.pagination);
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

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setEditingQuestion(null);
	};

	const handleSubmitQuestion = async (question: Question) => {
		try {
			if (editingQuestion) {
				// Update existing question
				await examApi.updateQuestion('barrister', 'paid', editingQuestion.id, question);
				toast.success('Question updated successfully');
			} else {
				// Create new question
				await examApi.createQuestion('barrister', 'paid', question);
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
			await examApi.deleteQuestion('barrister', 'paid', questionToDelete.id);
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
					Barrister Exam - Paid Exams
				</h1>
				<p className='text-gray-600'>
					Manage paid barrister exam tests and pricing
				</p>
			</Box>

			{isLoading ? (
				<TableSkeleton columns={columns.length} rows={5} />
			) : (
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
		</Box>
	);
};

export default BarristerPaidExam;

