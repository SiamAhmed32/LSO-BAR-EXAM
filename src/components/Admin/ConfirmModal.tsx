'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '../shared';
import { cn } from '@/lib/utils';
import { AlertTriangle, X } from 'lucide-react';
import AdminCustomButton from './AdminCustomButton';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning' | 'info';
	isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	variant = 'danger',
	isLoading = false,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			// Trigger animation after render
			setTimeout(() => setIsAnimating(true), 10);
		} else {
			setIsAnimating(false);
			// Remove from DOM after animation
			const timer = setTimeout(() => setShouldRender(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!shouldRender) return null;

	const variantStyles = {
		danger: {
			icon: 'text-red-600',
			iconBg: 'bg-red-100',
			button: 'bg-red-600 hover:bg-red-700 text-white',
		},
		warning: {
			icon: 'text-yellow-600',
			iconBg: 'bg-yellow-100',
			button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
		},
		info: {
			icon: 'text-blue-600',
			iconBg: 'bg-blue-100',
			button: 'bg-blue-600 hover:bg-blue-700 text-white',
		},
	};

	const styles = variantStyles[variant];

	const handleConfirm = () => {
		onConfirm();
	};

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
						'bg-primaryCard rounded-lg shadow-xl w-full max-w-md transition-all duration-300',
						isAnimating
							? 'opacity-100 scale-100 translate-y-0'
							: 'opacity-0 scale-95 translate-y-4'
					)}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<Box className='flex items-center justify-between p-6 border-b border-gray-200'>
						<Box className='flex items-center gap-3'>
							<Box
								className={cn(
									'p-2 rounded-full',
									styles.iconBg
								)}
							>
								<AlertTriangle
									className={cn('w-5 h-5', styles.icon)}
								/>
							</Box>
							<h2 className='text-xl font-semibold text-primaryText'>
								{title}
							</h2>
						</Box>
						<AdminCustomButton
							onClick={onClose}
							variant='icon'
							className='text-gray-400 hover:text-primaryText'
							disabled={isLoading}
						>
							<X className='w-5 h-5' />
						</AdminCustomButton>
					</Box>

					{/* Content */}
					<Box className='p-6'>
						<p className='text-gray-700 mb-6 whitespace-pre-line'>{message}</p>

						{/* Actions */}
						<Box className='flex items-center justify-end gap-3'>
							<AdminCustomButton
								onClick={onClose}
								variant='secondary'
								size='lg'
								disabled={isLoading}
							>
								{cancelText}
							</AdminCustomButton>
							<AdminCustomButton
								onClick={handleConfirm}
								variant='primary'
								size='lg'
								className={styles.button}
								disabled={isLoading}
							>
								{isLoading ? 'Processing...' : confirmText}
							</AdminCustomButton>
						</Box>
					</Box>
				</Box>
			</div>
		</>
	);
};

export default ConfirmModal;

