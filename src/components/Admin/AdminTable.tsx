'use client';

import React from 'react';
import { Box } from '../shared';
import { cn } from '@/lib/utils';
import AdminCustomButton from './AdminCustomButton';

export interface Column<T> {
	key: string;
	header: string;
	render?: (item: T, index: number) => React.ReactNode;
	className?: string;
}

interface AdminTableProps<T> {
	data: T[];
	columns: Column<T>[];
	onCreate?: () => void;
	createButtonText?: string;
	emptyMessage?: string;
	className?: string;
}

function AdminTable<T extends Record<string, any>>({
	data,
	columns,
	onCreate,
	createButtonText = 'Create',
	emptyMessage = 'No data available',
	className,
}: AdminTableProps<T>) {
	return (
		<Box className={cn('bg-primaryCard rounded-lg shadow-sm border border-gray-200', className)}>
			{/* Header with Create Button */}
			{(onCreate || data.length > 0) && (
				<Box className='p-6 border-b border-gray-200 flex items-center justify-between'>
					<h3 className='text-lg font-semibold text-primaryText'>
						Total: {data.length}
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
			)}

			{/* Table */}
			{data.length > 0 ? (
				<Box className='overflow-x-auto'>
					<table className='w-full'>
						<thead>
							<tr className='bg-gray-50 border-b border-gray-200'>
								{columns.map((column) => (
									<th
										key={column.key}
										className={cn(
											'px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider',
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
				<Box className='p-12 text-center'>
					<p className='text-gray-500 mb-4'>{emptyMessage}</p>
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
			)}
		</Box>
	);
}

export default AdminTable;

