'use client';

import React from 'react';
import { Box } from '../shared';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
	columns: number;
	rows?: number;
	className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
	columns,
	rows = 5,
	className,
}) => {
	return (
		<Box
			className={cn(
				'bg-primaryCard min-h-[75vh] rounded-lg shadow-sm border border-gray-200',
				className
			)}
		>
			{/* Header Skeleton */}
			<Box className='p-6 border-b border-gray-200 flex items-center justify-between'>
				<div className='h-6 w-24 bg-gray-200 rounded animate-pulse' />
				<div className='h-10 w-32 bg-gray-200 rounded animate-pulse' />
			</Box>

			{/* Table Skeleton */}
			<Box className='overflow-x-auto'>
				<table className='w-full'>
					<thead>
						<tr className='bg-gray-50 border-b border-gray-200'>
							{Array.from({ length: columns }).map((_, index) => (
								<th
									key={index}
									className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'
								>
									<div className='h-4 w-24 bg-gray-300 rounded animate-pulse' />
								</th>
							))}
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{Array.from({ length: rows }).map((_, rowIndex) => (
							<tr key={rowIndex} className='hover:bg-gray-50 transition-colors'>
								{Array.from({ length: columns }).map((_, colIndex) => (
									<td key={colIndex} className='px-6 py-4'>
										<div className='space-y-2'>
											<div className='h-4 bg-gray-200 rounded animate-pulse' />
											{colIndex === 1 && (
												<div className='space-y-1'>
													<div className='h-3 bg-gray-200 rounded animate-pulse w-3/4' />
													<div className='h-3 bg-gray-200 rounded animate-pulse w-2/3' />
												</div>
											)}
										</div>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</Box>
		</Box>
	);
};

export default TableSkeleton;

