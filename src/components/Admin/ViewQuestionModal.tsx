'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '../shared';
import { cn } from '@/lib/utils';
import { Eye, X, CheckCircle2 } from 'lucide-react';
import AdminCustomButton from './AdminCustomButton';
import { Question } from './ExamForm';

interface ViewQuestionModalProps {
	isOpen: boolean;
	onClose: () => void;
	question: Question | null;
}

const ViewQuestionModal: React.FC<ViewQuestionModalProps> = ({
	isOpen,
	onClose,
	question,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isOpen && question) {
			setShouldRender(true);
			// Trigger animation after render
			setTimeout(() => setIsAnimating(true), 10);
		} else {
			setIsAnimating(false);
			// Remove from DOM after animation
			const timer = setTimeout(() => setShouldRender(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen, question]);

	if (!shouldRender || !question) return null;

	return (
		<>
			{/* Overlay */}
			<div
				className={cn(
					'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300',
					isAnimating ? 'opacity-100' : 'opacity-0'
				)}
				onClick={onClose}
			>
				{/* Modal */}
				<Box
					className={cn(
						'bg-primaryCard rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300',
						isAnimating
							? 'opacity-100 scale-100 translate-y-0'
							: 'opacity-0 scale-95 translate-y-4'
					)}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<Box className='flex items-center justify-between p-6 border-b border-gray-200'>
						<Box className='flex items-center gap-3'>
							<Box className='p-2 rounded-full bg-blue-100'>
								<Eye className='w-5 h-5 text-blue-600' />
							</Box>
							<h2 className='text-xl font-semibold text-primaryText'>
								View Question
							</h2>
						</Box>
						<AdminCustomButton
							onClick={onClose}
							variant='icon'
							className='text-gray-400 hover:text-primaryText'
						>
							<X className='w-5 h-5' />
						</AdminCustomButton>
					</Box>

					{/* Content */}
					<Box className='p-6 overflow-y-auto flex-1'>
					{/* Question */}
					<Box className='mb-6'>
						<label className='block text-sm font-semibold text-gray-700 mb-2'>
							Question
						</label>
						<Box className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
							<p className='text-gray-900 text-base leading-relaxed'>
								{question.question}
							</p>
						</Box>
					</Box>

					{/* Options */}
						<Box>
							<label className='block text-sm font-semibold text-gray-700 mb-3'>
								Options ({question.options.length})
							</label>
							<Box className='space-y-3'>
								{question.options.map((option, index) => (
									<Box
										key={option.id}
										className={cn(
											'border rounded-lg p-4 transition-colors',
											option.isCorrect
												? 'bg-green-50 border-green-300'
												: 'bg-gray-50 border-gray-200'
										)}
									>
										<Box className='flex items-start gap-3'>
											<Box
												className={cn(
													'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold',
													option.isCorrect
														? 'bg-green-500 text-white'
														: 'bg-gray-300 text-gray-700'
												)}
											>
												{index + 1}
											</Box>
											<Box className='flex-1'>
												<p
													className={cn(
														'text-base',
														option.isCorrect
															? 'text-green-900 font-medium'
															: 'text-gray-700'
													)}
												>
													{option.text}
												</p>
											</Box>
											{option.isCorrect && (
												<Box className='flex-shrink-0'>
													<CheckCircle2 className='w-5 h-5 text-green-600' />
												</Box>
											)}
										</Box>
									</Box>
								))}
							</Box>
						</Box>

						{/* Correct Answer Summary */}
						<Box className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
							<Box className='flex items-center gap-2 mb-2'>
								<CheckCircle2 className='w-5 h-5 text-green-600' />
								<span className='text-sm font-semibold text-green-900'>
									Correct Answer
								</span>
							</Box>
							<p className='text-green-800 font-medium'>
								{question.options.find((opt) => opt.isCorrect)?.text ||
									'No correct answer set'}
							</p>
						</Box>

						{/* Explanation */}
						{question.explanation && (
							<Box className='mt-6'>
								<label className='block text-sm font-semibold text-gray-700 mb-2'>
									Explanation
								</label>
								<Box className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
									<p className='text-gray-900 text-base leading-relaxed whitespace-pre-wrap'>
										{question.explanation}
									</p>
								</Box>
							</Box>
						)}
					</Box>

					{/* Footer */}
					<Box className='p-6 border-t border-gray-200 flex items-center justify-end'>
						<AdminCustomButton
							onClick={onClose}
							variant='primary'
							size='lg'
						>
							Close
						</AdminCustomButton>
					</Box>
				</Box>
			</div>
		</>
	);
};

export default ViewQuestionModal;

