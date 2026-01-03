'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@/components/shared';
import {
	Activity,
	Calendar,
	User,
	Mail,
	FileText,
	ShoppingCart,
	CreditCard,
	GraduationCap,
	MessageSquare,
} from 'lucide-react';
import { AdminTable, Column, TableSkeleton } from '@/components/Admin';
import { toast } from 'react-toastify';

interface Activity {
	id: string;
	type: string;
	action: string;
	description: string;
	user: string;
	email?: string;
	metadata: any;
	time: string;
}

interface ActivitiesResponse {
	activities: Activity[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

const AdminActivitiesPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<any>(null);
	const pageLimit = 20;

	const fetchActivities = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`/api/admin/activities?page=${currentPage}&limit=${pageLimit}`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to load activities');
			}

			const result = await response.json();
			const data: ActivitiesResponse = result.data;
			setActivities(data.activities);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Error fetching activities:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to load activities'
			);
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, pageLimit]);

	useEffect(() => {
		fetchActivities();
	}, [fetchActivities]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

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

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'user':
				return User;
			case 'question':
				return FileText;
			case 'order':
				return ShoppingCart;
			case 'payment':
				return CreditCard;
			case 'exam_attempt':
				return GraduationCap;
			case 'contact':
				return MessageSquare;
			default:
				return Activity;
		}
	};

	const getActivityColor = (type: string) => {
		switch (type) {
			case 'user':
				return 'bg-blue-500';
			case 'question':
				return 'bg-green-500';
			case 'order':
				return 'bg-purple-500';
			case 'payment':
				return 'bg-yellow-500';
			case 'exam_attempt':
				return 'bg-indigo-500';
			case 'contact':
				return 'bg-pink-500';
			default:
				return 'bg-gray-500';
		}
	};

	const columns: Column<Activity>[] = [
		{
			key: 'action',
			header: 'Activity',
			render: (item) => {
				const Icon = getActivityIcon(item.type);
				const colorClass = getActivityColor(item.type);
				return (
					<Box className='flex items-center gap-3'>
						<Box
							className={`${colorClass} p-2 rounded-lg text-white flex-shrink-0`}
						>
							<Icon className='w-4 h-4' />
						</Box>
						<Box className='flex flex-col'>
							<span className='text-sm font-medium text-primaryText'>
								{item.action}
							</span>
							<span className='text-xs text-gray-500'>{item.description}</span>
						</Box>
					</Box>
				);
			},
		},
		{
			key: 'user',
			header: 'User',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					<User className='w-4 h-4 text-gray-400' />
					<Box className='flex flex-col'>
						<span className='text-sm text-gray-900'>{item.user}</span>
						{item.email && (
							<span className='text-xs text-gray-500'>{item.email}</span>
						)}
					</Box>
				</Box>
			),
		},
		{
			key: 'time',
			header: 'Time',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					<Calendar className='w-4 h-4 text-gray-400' />
					<Box className='flex flex-col'>
						<span className='text-sm text-gray-900'>{formatDate(item.time)}</span>
						<span className='text-xs text-gray-500'>
							{formatTimeAgo(item.time)}
						</span>
					</Box>
				</Box>
			),
		},
	];

	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<Activity className='w-8 h-8' />
					Activity Log
				</h1>
				<p className='text-gray-600'>
					View all system activities from first to last
				</p>
			</Box>

			{isLoading ? (
				<TableSkeleton columns={columns.length} rows={5} />
			) : (
				<AdminTable
					data={activities}
					columns={columns}
					emptyMessage='No activities found'
					pagination={pagination}
					onPageChange={handlePageChange}
					fixedHeight={true}
					tableHeight='600px'
				/>
			)}
		</Box>
	);
};

export default AdminActivitiesPage;

