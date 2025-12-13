'use client';

import React, { useState } from 'react';
import { Box } from '../ui';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<Box className='flex h-screen bg-gray-50'>
			{/* Sidebar */}
			<AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

			{/* Main Content */}
			<Box className='flex-1 flex flex-col overflow-hidden'>
				{/* Header */}
				<AdminHeader
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				{/* Page Content */}
				<Box className='flex-1 overflow-y-auto bg-gray-50'>
					{children}
				</Box>
			</Box>
		</Box>
	);
};

export default AdminLayout;

