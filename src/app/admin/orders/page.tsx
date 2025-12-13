'use client';

import React from 'react';
import { Box } from '@/components/ui';
import { ShoppingCart } from 'lucide-react';

const AdminOrders = () => {
	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<ShoppingCart className='w-8 h-8' />
					Order Management
				</h1>
				<p className='text-gray-600'>View and manage all orders</p>
			</Box>
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
				<p className='text-gray-500'>Order management interface coming soon</p>
			</Box>
		</Box>
	);
};

export default AdminOrders;

