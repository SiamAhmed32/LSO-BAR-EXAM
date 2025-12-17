'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '../shared';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import AdminCustomButton from './AdminCustomButton';

interface AdminDialogProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	className?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AdminDialog: React.FC<AdminDialogProps> = ({
	isOpen,
	onClose,
	title,
	children,
	className,
	size = 'md',
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

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-2xl',
		lg: 'max-w-4xl',
		xl: 'max-w-6xl',
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
				{/* Dialog */}
				<Box
					className={cn(
						'bg-primaryCard rounded-lg shadow-xl w-full transition-all duration-300',
						sizeClasses[size],
						isAnimating
							? 'opacity-100 scale-100 translate-y-0'
							: 'opacity-0 scale-95 translate-y-4',
						className
					)}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<Box className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold text-primaryText'>{title}</h2>
						<AdminCustomButton
							onClick={onClose}
							variant='icon'
							className='text-gray-400 hover:text-primaryText'
						>
							<X className='w-5 h-5' />
						</AdminCustomButton>
					</Box>

					{/* Content */}
					<Box className='p-6 max-h-[calc(100vh-200px)] overflow-y-auto'>
						{children}
					</Box>
				</Box>
			</div>
		</>
	);
};

export default AdminDialog;

