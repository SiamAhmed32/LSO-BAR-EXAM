'use client';

import React from 'react';
import { Box } from '@/components/reusables';
import { BarChart3 } from 'lucide-react';

const AdminAnalytics = () => {
	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<BarChart3 className='w-8 h-8' />
					Analytics
				</h1>
				<p className='text-gray-600'>View detailed analytics and insights</p>
			</Box>
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
				<p className='text-gray-500'>Analytics dashboard coming soon</p>
			</Box>
		</Box>
	);
};

export default AdminAnalytics;

