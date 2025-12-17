'use client';

import React from 'react';
import { Box } from '../shared';
import { cn } from '@/lib/utils';
import AdminCustomButton from './AdminCustomButton';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
	key: string;
	header: string;
	render?: (item: T, index: number) => React.ReactNode;
	className?: string;
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

interface AdminTableProps<T> {
	data: T[];
	columns: Column<T>[];
	onCreate?: () => void;
	createButtonText?: string;
	emptyMessage?: string;
	className?: string;
	pagination?: PaginationInfo;
	onPageChange?: (page: number) => void;
	fixedHeight?: boolean;
	tableHeight?: string;
}

function AdminTable<T extends Record<string, any>>({
	data,
	columns,
	onCreate,
	createButtonText = 'Create',
	emptyMessage = 'No data available',
	className,
	pagination,
	onPageChange,
	fixedHeight = true,
	tableHeight = '600px',
}: AdminTableProps<T>) {
	const handlePageChange = (newPage: number) => {
		if (onPageChange && pagination) {
			if (newPage >= 1 && newPage <= pagination.totalPages) {
				onPageChange(newPage);
			}
		}
	};

	return (
		<Box className={cn('bg-primaryCard min-h-[75vh] rounded-lg shadow-sm border border-gray-200 flex flex-col', className)}>
			{/* Header with Create Button */}
			<Box className='p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0'>
				<h3 className='text-lg font-semibold text-primaryText'>
					Total: {pagination?.total ?? data.length}
				</h3>
				{onCreate && (
					<AdminCustomButton
						onClick={onCreate}
						variant='primary'
						size='md'
					>
						{createButtonText}
					</AdminCustomButton>
				)}
			</Box>

			{/* Table Container with Fixed Height */}
			<Box
				className={cn(
					'flex-1 overflow-hidden',
					fixedHeight && 'flex flex-col'
				)}
				style={fixedHeight ? { height: tableHeight } : undefined}
			>
				{data.length > 0 ? (
					<Box className='overflow-x-auto overflow-y-auto h-full'>
						<table className='w-full'>
							<thead className='sticky top-0 z-10'>
								<tr className='bg-gray-50 border-b border-gray-200'>
									{columns.map((column) => (
										<th
											key={column.key}
											className={cn(
												'px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50',
												column.className
											)}
										>
											{column.header}
										</th>
									))}
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{data.map((item, index) => (
									<tr
										key={index}
										className='hover:bg-gray-50 transition-colors'
									>
										{columns.map((column) => (
											<td
												key={column.key}
												className={cn(
													'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
													column.className
												)}
											>
												{column.render
													? column.render(item, index)
													: item[column.key] || '-'}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</Box>
				) : (
					<Box className='h-[calc(75vh-200px)] flex items-center justify-center'>
						<Box className='text-center'>
							<Box className='flex justify-center mb-4'>
								<Box className='p-4 rounded-full bg-gray-100'>
									<Inbox className='w-12 h-12 text-gray-400' />
								</Box>
							</Box>
							<p className='text-gray-500 mb-4 text-lg'>{emptyMessage}</p>
							{onCreate && (
								<AdminCustomButton
									onClick={onCreate}
									variant='primary'
									size='lg'
								>
									{createButtonText}
								</AdminCustomButton>
							)}
						</Box>
					</Box>
				)}
			</Box>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<Box className='p-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0'>
					<Box className='flex items-center gap-2'>
						<span className='text-sm text-gray-700'>
							Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
							{Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
							{pagination.total} results
						</span>
					</Box>
					<Box className='flex items-center gap-2'>
						<AdminCustomButton
							onClick={() => handlePageChange(pagination.page - 1)}
							variant='secondary'
							size='sm'
							disabled={!pagination.hasPrevPage}
							className='flex items-center gap-1'
						>
							<ChevronLeft className='w-4 h-4' />
							Previous
						</AdminCustomButton>
						<Box className='flex items-center gap-1'>
							{Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
								let pageNum: number;
								if (pagination.totalPages <= 5) {
									pageNum = i + 1;
								} else if (pagination.page <= 3) {
									pageNum = i + 1;
								} else if (pagination.page >= pagination.totalPages - 2) {
									pageNum = pagination.totalPages - 4 + i;
								} else {
									pageNum = pagination.page - 2 + i;
								}

								return (
									<AdminCustomButton
										key={pageNum}
										onClick={() => handlePageChange(pageNum)}
										variant={pagination.page === pageNum ? 'primary' : 'ghost'}
										size='sm'
										className={cn(
											pagination.page === pageNum &&
												'bg-button text-white hover:bg-button-dark'
										)}
									>
										{pageNum}
									</AdminCustomButton>
								);
							})}
						</Box>
						<AdminCustomButton
							onClick={() => handlePageChange(pagination.page + 1)}
							variant='secondary'
							size='sm'
							disabled={!pagination.hasNextPage}
							className='flex items-center gap-1'
						>
							Next
							<ChevronRight className='w-4 h-4' />
						</AdminCustomButton>
					</Box>
				</Box>
			)}
		</Box>
	);
}

export default AdminTable;

