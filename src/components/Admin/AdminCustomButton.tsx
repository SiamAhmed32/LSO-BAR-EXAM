'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AdminCustomButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
	size?: 'sm' | 'md' | 'lg';
	children: React.ReactNode;
}

const AdminCustomButton: React.FC<AdminCustomButtonProps> = ({
	variant = 'primary',
	size = 'md',
	className,
	children,
	...props
}) => {
	const baseClasses = 'rounded-lg transition-colors cursor-pointer font-medium';
	
	const variantClasses = {
		primary: 'bg-button text-white hover:bg-button-dark',
		secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
		danger: 'text-red-600 hover:bg-red-50',
		ghost: 'text-gray-600 hover:bg-gray-100',
		icon: 'p-1 text-gray-600 hover:bg-gray-100',
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-2.5 text-base',
	};

	return (
		<button
			className={cn(
				baseClasses,
				variantClasses[variant],
				sizeClasses[size],
				variant === 'icon' && 'p-1',
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
};

export default AdminCustomButton;

