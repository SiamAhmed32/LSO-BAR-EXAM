'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@/components/shared';
import { Users, Mail, Calendar, Shield } from 'lucide-react';
import { AdminTable, Column, TableSkeleton } from '@/components/Admin';
import { toast } from 'react-toastify';

interface User {
	id: string;
	name: string;
	email: string;
	role: 'USER' | 'ADMIN';
	createdAt: string;
	updatedAt: string;
}

interface UsersResponse {
	users: User[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

const AdminUsers = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [users, setUsers] = useState<User[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<any>(null);
	const pageLimit = 10;

	const fetchUsers = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`/api/users?page=${currentPage}&limit=${pageLimit}`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to load users');
			}

			const result = await response.json();
			const data: UsersResponse = result.data;
			setUsers(data.users);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Error fetching users:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to load users');
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, pageLimit]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const columns: Column<User>[] = [
		{
			key: 'name',
			header: 'Name',
			render: (item) => (
				<Box className='flex items-center gap-3'>
					<Box className='w-10 h-10 bg-button rounded-full flex items-center justify-center text-white'>
						<Users className='w-5 h-5' />
					</Box>
					<span className='text-sm font-medium text-primaryText'>{item.name}</span>
				</Box>
			),
		},
		{
			key: 'email',
			header: 'Email',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					<Mail className='w-4 h-4 text-gray-400' />
					<span className='text-sm text-gray-700'>{item.email}</span>
				</Box>
			),
		},
		{
			key: 'role',
			header: 'Role',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					<Shield
						className={`w-4 h-4 ${
							item.role === 'ADMIN' ? 'text-red-600' : 'text-blue-600'
						}`}
					/>
					<span
						className={`text-sm font-medium px-2 py-1 rounded ${
							item.role === 'ADMIN'
								? 'bg-red-100 text-red-700'
								: 'bg-blue-100 text-blue-700'
						}`}
					>
						{item.role}
					</span>
				</Box>
			),
		},
		{
			key: 'createdAt',
			header: 'Joined',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					<Calendar className='w-4 h-4 text-gray-400' />
					<span className='text-sm text-gray-600'>
						{new Date(item.createdAt).toLocaleDateString()}
					</span>
				</Box>
			),
		},
	];

	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<Users className='w-8 h-8' />
					User 
				</h1>
				<p className='text-gray-600'>Monitor all users</p>
			</Box>

			{isLoading ? (
				<TableSkeleton columns={columns.length} rows={5} />
			) : (
				<AdminTable
					data={users}
					columns={columns}
					emptyMessage='No users found'
					pagination={pagination}
					onPageChange={handlePageChange}
					fixedHeight={true}
					tableHeight='600px'
				/>
			)}
		</Box>
	);
};

export default AdminUsers;


