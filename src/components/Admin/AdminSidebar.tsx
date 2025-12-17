'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box } from '../shared';
import { cn } from '@/lib/utils';
import AdminCustomButton from './AdminCustomButton';
import {
	LayoutDashboard,
	Users,
	ShoppingCart,
	Package,
	FileText,
	Settings,
	BarChart3,
	Menu,
	X,
	LogOut,
	ChevronDown,
	ChevronRight,
	GraduationCap,
	BookOpen,
	Home,
} from 'lucide-react';

interface AdminSidebarProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

const menuItems = [
	{
		title: 'Dashboard',
		href: '/admin/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Users',
		href: '/admin/users',
		icon: Users,
	},
	{
		title: 'Orders',
		href: '/admin/orders',
		icon: ShoppingCart,
	},

];

const examMenuItems = [
	{
		title: 'Barrister Exam',
		icon: GraduationCap,
		subItems: [
			{
				title: 'Free Exam',
				href: '/admin/barrister-exam/free-exam',
			},
			{
				title: 'Paid Exam',
				href: '/admin/barrister-exam/paid-exam',
			},
		],
	},
	{
		title: 'Solicitor Exam',
		icon: BookOpen,
		subItems: [
			{
				title: 'Free Exam',
				href: '/admin/solicitor-exam/free-exam',
			},
			{
				title: 'Paid Exam',
				href: '/admin/solicitor-exam/paid-exam',
			},
		],
	},
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
	const pathname = usePathname();
	const [openMenus, setOpenMenus] = useState<string[]>([]);

	// Auto-open menu if one of its sub-items is active
	useEffect(() => {
		const activeMenus: string[] = [];
		examMenuItems.forEach((examItem) => {
			const hasActiveSubItem = examItem.subItems.some(
				(subItem) => pathname === subItem.href
			);
			if (hasActiveSubItem) {
				activeMenus.push(examItem.title);
			}
		});
		if (activeMenus.length > 0) {
			setOpenMenus(activeMenus);
		}
	}, [pathname]);

	const toggleMenu = (title: string) => {
		setOpenMenus((prev) =>
			prev.includes(title)
				? prev.filter((item) => item !== title)
				: [...prev, title]
		);
	};

	const isMenuOpen = (title: string) => openMenus.includes(title);

	const isSubItemActive = (href: string) => pathname === href;

	const handleLogout = async () => {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});

			if (response.ok) {
				// Redirect to login page after successful logout
				window.location.href = '/login';
			} else {
				console.error('Logout failed');
				// Still redirect even if API call fails
				window.location.href = '/login';
			}
		} catch (error) {
			console.error('Logout error:', error);
			// Redirect to login page even if there's an error
			window.location.href = '/login';
		}
	};

	return (
		<>
			{/* Mobile Overlay */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<Box
				className={cn(
					'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primaryCard border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				{/* Logo and Close Button */}
				<Box className='flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0'>
					<h1 className='text-xl font-bold text-primaryText'>Admin Panel</h1>
					<AdminCustomButton
						onClick={() => setIsOpen(false)}
						variant='icon'
						className='lg:hidden text-gray-500 hover:text-primaryText'
					>
						<X className='w-6 h-6' />
					</AdminCustomButton>
				</Box>

				{/* Navigation */}
				<Box className='p-4 space-y-2 overflow-y-auto flex-1'>
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className={cn(
									'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
									isActive
										? 'bg-button text-white'
										: 'text-gray-700 hover:bg-gray-100'
								)}
							>
								<Icon className='w-5 h-5' />
								<span className='font-medium'>{item.title}</span>
							</Link>
						);
					})}

					{/* Exam Sections */}
					<Box className='pt-4 mt-4 border-t border-gray-200'>
						{examMenuItems.map((examItem) => {
							const Icon = examItem.icon;
							const isOpen = isMenuOpen(examItem.title);
							const hasActiveSubItem = examItem.subItems.some((subItem) =>
								isSubItemActive(subItem.href)
							);

							return (
								<Box key={examItem.title} className='mb-2'>
									<AdminCustomButton
										onClick={() => toggleMenu(examItem.title)}
										variant='ghost'
										className={cn(
											'flex items-center justify-between w-full',
											hasActiveSubItem
												? 'bg-button text-white hover:bg-button-dark'
												: ''
										)}
									>
										<Box className='flex items-center gap-3'>
											<Icon className='w-5 h-5' />
											<span className='font-medium'>{examItem.title}</span>
										</Box>
										<Box className='transition-transform duration-300 ease-in-out'>
											{isOpen ? (
												<ChevronDown className='w-4 h-4 transition-all duration-300' />
											) : (
												<ChevronRight className='w-4 h-4 transition-all duration-300' />
											)}
										</Box>
									</AdminCustomButton>

									<Box
										className={cn(
											'overflow-hidden transition-all duration-300 ease-in-out',
											isOpen
												? 'max-h-96 opacity-100 mt-1'
												: 'max-h-0 opacity-0 mt-0'
										)}
									>
										<Box className='ml-4 space-y-1'>
											{examItem.subItems.map((subItem) => {
												const isActive = isSubItemActive(subItem.href);
												return (
													<Link
														key={subItem.href}
														href={subItem.href}
														onClick={() => setIsOpen(false)}
														className={cn(
															'flex items-center px-4 py-2 rounded-lg transition-colors text-sm',
															isActive
																? 'bg-button text-white'
																: 'text-gray-600 hover:bg-gray-100'
														)}
													>
														<span>{subItem.title}</span>
													</Link>
												);
											})}
										</Box>
									</Box>
								</Box>
							);
						})}
					</Box>

				</Box>

				{/* Bottom Buttons - Home and Logout */}
				<Box className='p-4 border-t border-gray-200 flex-shrink-0 space-y-2 bg-primaryCard'>
					<Link href='/' className='block'>
						<AdminCustomButton
							variant='ghost'
							className='flex items-center gap-3 w-full'
						>
							<Home className='w-5 h-5' />
							<span className='font-medium'>Home</span>
						</AdminCustomButton>
					</Link>
					<AdminCustomButton
						variant='danger'
						className='flex items-center gap-3 w-full'
						onClick={handleLogout}
					>
						<LogOut className='w-5 h-5' />
						<span className='font-medium'>Logout</span>
					</AdminCustomButton>
				</Box>
			</Box>
		</>
	);
};

export default AdminSidebar;

