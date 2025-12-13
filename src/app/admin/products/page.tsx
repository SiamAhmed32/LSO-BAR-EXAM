'use client';

import React from 'react';
import { Box } from '@/components/ui';
import { Package } from 'lucide-react';

const AdminProducts = () => {
	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<Package className='w-8 h-8' />
					Product Management
				</h1>
				<p className='text-gray-600'>Manage your product catalog</p>
			</Box>
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
				<p className='text-gray-500'>Product management interface coming soon</p>
			</Box>
		</Box>
	);
};

export default AdminProducts;

