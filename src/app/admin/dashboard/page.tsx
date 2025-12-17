'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	Users,
	ShoppingCart,
	FileText,
	Activity,
	GraduationCap,
	BookOpen,
	Clock,
} from 'lucide-react';
import { Box } from '@/components';
import { toast } from 'react-toastify';
import { useUser } from '@/components/context/UserContext';

interface DashboardStats {
	totalUsers: number;
	totalOrders: number;
	totalQuestions: number;
	examCounts: {
		barristerFree: number;
		barristerPaidSetA: number;
		barristerPaidSetB: number;
		solicitorFree: number;
		solicitorPaidSetA: number;
		solicitorPaidSetB: number;
	};
}

interface RecentActivity {
	id: string;
	type: string;
	action: string;
	user: string;
	email?: string;
	time: string;
}

const AdminDashboard = () => {
	const router = useRouter();
	const { user, isAuthenticated } = useUser();
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

	// Check admin access on mount
	useEffect(() => {
		if (!isAuthenticated || user?.role !== 'ADMIN') {
			router.push('/login');
			return;
		}
		// Only fetch data if user is authenticated and is admin
		if (isAuthenticated && user?.role === 'ADMIN') {
			fetchDashboardData();
		}
	}, [isAuthenticated, user, router]);

	const fetchDashboardData = async () => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/admin/dashboard', {
				method: 'GET',
				credentials: 'include',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to load dashboard data');
			}

			const result = await response.json();
			setStats(result.data.stats);
			setRecentActivity(result.data.recentActivity);
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to load dashboard data'
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Early return if not admin (while checking)
	if (!isAuthenticated || user?.role !== 'ADMIN') {
		return null; // Will redirect via useEffect
	}

	const formatTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return 'Just now';
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)} minutes ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)} hours ago`;
		if (diffInSeconds < 604800)
			return `${Math.floor(diffInSeconds / 86400)} days ago`;
		return date.toLocaleDateString();
	};

	const statsCards = stats
		? [
				{
					title: 'Total Users',
					value: stats.totalUsers.toLocaleString(),
					icon: Users,
					color: 'bg-blue-500',
				},
				{
					title: 'Total Orders',
					value: stats.totalOrders.toLocaleString(),
					icon: ShoppingCart,
					color: 'bg-purple-500',
				},
				{
					title: 'All Exams',
					value: stats.totalQuestions.toLocaleString(),
					icon: FileText,
					color: 'bg-green-500',
				},
			
		  ]
		: [];

	if (isLoading) {
		return (
			<Box className='p-6 space-y-6'>
				{/* Page Header Skeleton */}
				<Box className='mb-8'>
					<Box className='h-9 bg-gray-200 rounded w-64 mb-2 animate-pulse'>{null}</Box>
					<Box className='h-5 bg-gray-200 rounded w-96 animate-pulse'>{null}</Box>
				</Box>

				{/* Stats Grid Skeleton */}
				<Box className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{[1, 2, 3].map((i) => (
						<Box
							key={i}
							className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse'
						>
							<Box className='flex items-center justify-between mb-4'>
								<Box className='w-12 h-12 bg-gray-200 rounded-lg'>{null}</Box>
							</Box>
							<Box className='h-4 bg-gray-200 rounded w-24 mb-2'>{null}</Box>
							<Box className='h-8 bg-gray-200 rounded w-20'>{null}</Box>
						</Box>
					))}
				</Box>

				{/* Exam Breakdown Skeleton */}
				<Box className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{[1, 2, 3, 4].map((i) => (
						<Box
							key={i}
							className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse'
						>
							<Box className='flex items-center gap-3 mb-4'>
								<Box className='w-5 h-5 bg-gray-200 rounded'>{null}</Box>
								<Box className='h-4 bg-gray-200 rounded w-24'>{null}</Box>
							</Box>
							<Box className='h-8 bg-gray-200 rounded w-12 mb-2'>{null}</Box>
							<Box className='h-3 bg-gray-200 rounded w-16'>{null}</Box>
						</Box>
					))}
				</Box>

				{/* Recent Activities Skeleton */}
				<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
					<Box className='flex items-center justify-between mb-6'>
						<Box className='h-6 bg-gray-200 rounded w-40 animate-pulse'>{null}</Box>
						<Box className='w-5 h-5 bg-gray-200 rounded animate-pulse'>{null}</Box>
					</Box>
					<Box className='space-y-4'>
						{[1, 2, 3, 4].map((i) => (
							<Box
								key={i}
								className='border-l-4 border-gray-200 pl-4 py-2 animate-pulse'
							>
								<Box className='h-4 bg-gray-200 rounded w-3/4 mb-2'>{null}</Box>
								<Box className='h-3 bg-gray-200 rounded w-1/2'>{null}</Box>
							</Box>
						))}
					</Box>
				</Box>
			</Box>
		);
	}

	return (
		<Box className='p-6 space-y-6'>
			{/* Page Header */}
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2'>
					Dashboard Overview
				</h1>
				<p className='text-gray-600'>
					Welcome back! Here's what's happening with your platform .
				</p>
			</Box>

			{/* Stats Grid */}
			<Box className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{statsCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Box
							key={index}
							className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'
						>
							<Box className='flex items-center justify-between mb-4'>
								<Box
									className={`${stat.color} p-3 rounded-lg text-white`}
								>
									<Icon className='w-6 h-6' />
								</Box>
							</Box>
							<h3 className='text-gray-600 text-sm mb-1'>{stat.title}</h3>
							<p className='text-2xl font-bold text-primaryText'>
								{stat.value}
							</p>
						</Box>
					);
				})}
			</Box>

			{/* Exam Breakdown */}
			{stats && (
				<Box className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
						<Box className='flex items-center gap-3 mb-4'>
							<GraduationCap className='w-5 h-5 text-blue-600' />
							<h3 className='text-sm font-semibold text-gray-700'>
								Barrister Free
							</h3>
						</Box>
						<p className='text-2xl font-bold text-primaryText'>
							{stats.examCounts.barristerFree}
						</p>
						<p className='text-xs text-gray-500 mt-1'>questions</p>
					</Box>
					<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
						<Box className='flex items-center gap-3 mb-4'>
							<GraduationCap className='w-5 h-5 text-purple-600' />
							<h3 className='text-sm font-semibold text-gray-700'>
								Barrister Paid Set A
							</h3>
						</Box>
						<p className='text-2xl font-bold text-primaryText'>
							{stats.examCounts.barristerPaidSetA}
						</p>
						<p className='text-xs text-gray-500 mt-1'>questions</p>
					</Box>
					<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
						<Box className='flex items-center gap-3 mb-4'>
							<GraduationCap className='w-5 h-5 text-indigo-600' />
							<h3 className='text-sm font-semibold text-gray-700'>
								Barrister Paid Set B
							</h3>
						</Box>
						<p className='text-2xl font-bold text-primaryText'>
							{stats.examCounts.barristerPaidSetB}
						</p>
						<p className='text-xs text-gray-500 mt-1'>questions</p>
					</Box>
					<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
						<Box className='flex items-center gap-3 mb-4'>
							<BookOpen className='w-5 h-5 text-green-600' />
							<h3 className='text-sm font-semibold text-gray-700'>
								Solicitor Free
							</h3>
						</Box>
						<p className='text-2xl font-bold text-primaryText'>
							{stats.examCounts.solicitorFree}
						</p>
						<p className='text-xs text-gray-500 mt-1'>questions</p>
					</Box>
					<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
						<Box className='flex items-center gap-3 mb-4'>
							<BookOpen className='w-5 h-5 text-orange-600' />
							<h3 className='text-sm font-semibold text-gray-700'>
								Solicitor Paid Set A
							</h3>
						</Box>
						<p className='text-2xl font-bold text-primaryText'>
							{stats.examCounts.solicitorPaidSetA}
						</p>
						<p className='text-xs text-gray-500 mt-1'>questions</p>
					</Box>
					<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
						<Box className='flex items-center gap-3 mb-4'>
							<BookOpen className='w-5 h-5 text-red-600' />
							<h3 className='text-sm font-semibold text-gray-700'>
								Solicitor Paid Set B
							</h3>
						</Box>
						<p className='text-2xl font-bold text-primaryText'>
							{stats.examCounts.solicitorPaidSetB}
						</p>
						<p className='text-xs text-gray-500 mt-1'>questions</p>
					</Box>
				</Box>
			)}

			{/* Recent Activities */}
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
				<Box className='flex items-center justify-between mb-6'>
					<h2 className='text-xl font-semibold text-primaryText'>
						Recent Activity
					</h2>
					<Activity className='w-5 h-5 text-gray-400' />
				</Box>
				<Box className='space-y-4'>
					{recentActivity.length > 0 ? (
						recentActivity.map((activity) => (
							<Box
								key={activity.id}
								className='border-l-4 border-button pl-4 py-2'
							>
								<p className='text-sm font-medium text-primaryText'>
									{activity.action}
								</p>
								<Box className='flex items-center gap-2 mt-1'>
									<Clock className='w-3 h-3 text-gray-400' />
									<p className='text-xs text-gray-500'>
										{activity.user}
										{activity.email && ` (${activity.email})`} •{' '}
										{formatTimeAgo(activity.time)}
									</p>
								</Box>
							</Box>
						))
					) : (
						<Box className='text-center py-8'>
							<Activity className='w-12 h-12 text-gray-300 mx-auto mb-2' />
							<p className='text-gray-500'>No recent activity</p>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default AdminDashboard;

