'use client';

import React from 'react';
import { Box } from '@/components/shared';
import { Settings } from 'lucide-react';

const AdminSettings = () => {
	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<Settings className='w-8 h-8' />
					Settings
				</h1>
				<p className='text-gray-600'>Manage your admin settings</p>
			</Box>
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
				<p className='text-gray-500'>Settings interface coming soon</p>
			</Box>
		</Box>
	);
};

export default AdminSettings;

