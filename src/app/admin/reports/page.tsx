'use client';

import React from 'react';
import { Box } from '@/components/reusables';
import { FileText } from 'lucide-react';

const AdminReports = () => {
	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<FileText className='w-8 h-8' />
					Reports
				</h1>
				<p className='text-gray-600'>Generate and view reports</p>
			</Box>
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
				<p className='text-gray-500'>Reports interface coming soon</p>
			</Box>
		</Box>
	);
};

export default AdminReports;

