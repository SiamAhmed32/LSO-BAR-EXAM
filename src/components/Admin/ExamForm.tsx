'use client';

import React, { useState } from 'react';
import { Box } from '../ui';
import { Plus, X } from 'lucide-react';
import AdminCustomButton from './AdminCustomButton';

export interface Question {
	id: string;
	question: string;
	options: Option[];
}

export interface Option {
	id: string;
	text: string;
	isCorrect: boolean;
}

interface ExamFormProps {
	onSubmit: (question: Question) => void;
	onCancel: () => void;
	initialData?: Question;
}

const ExamForm: React.FC<ExamFormProps> = ({
	onSubmit,
	onCancel,
	initialData,
}) => {
	const [questionText, setQuestionText] = useState(
		initialData?.question || ''
	);
	const [options, setOptions] = useState<Option[]>(
		initialData?.options || [
			{ id: Date.now().toString() + '-1', text: '', isCorrect: false },
			{ id: Date.now().toString() + '-2', text: '', isCorrect: false },
		]
	);

	const addOption = () => {
		setOptions([
			...options,
			{
				id: Date.now().toString(),
				text: '',
				isCorrect: false,
			},
		]);
	};

	const removeOption = (optionId: string) => {
		if (options.length > 2) {
			setOptions(options.filter((opt) => opt.id !== optionId));
		}
	};

	const updateOption = (optionId: string, field: string, value: string | boolean) => {
		setOptions(
			options.map((opt) =>
				opt.id === optionId ? { ...opt, [field]: value } : opt
			)
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const question: Question = {
			id: initialData?.id || Date.now().toString(),
			question: questionText,
			options: options,
		};
		onSubmit(question);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{/* Question Text */}
			<Box>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Question Text *
				</label>
				<textarea
					required
					value={questionText}
					onChange={(e) => setQuestionText(e.target.value)}
					rows={3}
					className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button focus:border-transparent outline-none'
					placeholder='Enter your question'
				/>
			</Box>

			{/* Options */}
			<Box className='space-y-3'>
				<Box className='flex items-center justify-between mb-2'>
					<label className='text-sm font-medium text-gray-700'>
						Options *
					</label>
					<AdminCustomButton
						type='button'
						onClick={addOption}
						variant='ghost'
						size='sm'
						className='flex items-center gap-1 text-button hover:text-button-dark'
					>
						<Plus className='w-3 h-3' />
						Add Option
					</AdminCustomButton>
				</Box>

				{options.map((option, oIndex) => (
					<Box
						key={option.id}
						className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200'
					>
						<input
							type='radio'
							name='correct-option'
							checked={option.isCorrect}
							onChange={() => {
								// Uncheck all other options
								setOptions(
									options.map((opt) => ({
										...opt,
										isCorrect: opt.id === option.id,
									}))
								);
							}}
							className='w-4 h-4 text-button focus:ring-button'
						/>
						<input
							type='text'
							required
							value={option.text}
							onChange={(e) =>
								updateOption(option.id, 'text', e.target.value)
							}
							className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button focus:border-transparent outline-none bg-white'
							placeholder={`Option ${oIndex + 1}`}
						/>
						{options.length > 2 && (
							<AdminCustomButton
								type='button'
								onClick={() => removeOption(option.id)}
								variant='icon'
								className='text-red-600 hover:text-red-700 hover:bg-red-50'
							>
								<X className='w-4 h-4' />
							</AdminCustomButton>
						)}
						{option.isCorrect && (
							<span className='text-xs text-green-600 font-medium'>
								Correct
							</span>
						)}
					</Box>
				))}

				{options.length < 2 && (
					<p className='text-xs text-red-600'>At least 2 options are required</p>
				)}
			</Box>

			{/* Form Actions */}
			<Box className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
				<AdminCustomButton
					type='button'
					onClick={onCancel}
					variant='secondary'
					size='lg'
				>
					Cancel
				</AdminCustomButton>
				<AdminCustomButton
					type='submit'
					variant='primary'
					size='lg'
				>
					Create Question
				</AdminCustomButton>
			</Box>
		</form>
	);
};

export default ExamForm;

