'use client';

import React from 'react';
import { Box } from '@/components/shared';
import { Users } from 'lucide-react';

const AdminUsers = () => {
	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<Users className='w-8 h-8' />
					User Management
				</h1>
				<p className='text-gray-600'>Manage and monitor all users</p>
			</Box>
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
				<p className='text-gray-500'>User management interface coming soon</p>
			</Box>
		</Box>
	);
};

export default AdminUsers;

