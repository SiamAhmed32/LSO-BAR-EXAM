'use client';

import React from 'react';
import { Box } from '../shared';
import { Menu, Bell, Search, User } from 'lucide-react';
import AdminCustomButton from './AdminCustomButton';
import { useUser } from '../context/UserContext';

interface AdminHeaderProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
	sidebarOpen,
	setSidebarOpen,
}) => {
	const { user } = useUser();

	return (
		<Box className='bg-primaryCard border-b border-gray-200 px-6 py-4'>
			<Box className='flex items-center justify-between'>
				{/* Left Section */}
				<Box className='flex items-center gap-4'>
					<AdminCustomButton
						onClick={() => setSidebarOpen(!sidebarOpen)}
						variant='icon'
						className='lg:hidden text-gray-600 hover:text-primaryText'
					>
						<Menu className='w-6 h-6' />
					</AdminCustomButton>
					{/* Search Bar */}
					<Box className='hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-64'>
						<Search className='w-4 h-4 text-gray-400' />
						<input
							type='text'
							placeholder='Search...'
							className='bg-transparent border-none outline-none text-sm flex-1'
						/>
					</Box>
				</Box>

				{/* Right Section */}
				<Box className='flex items-center gap-4'>
					{/* Notifications */}
					{/* <AdminCustomButton
						variant='icon'
						className='relative text-gray-600 hover:text-primaryText'
					>
						<Bell className='w-5 h-5' />
						<span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
					</AdminCustomButton> */}

					{/* User Profile */}
					<Box className='flex items-center gap-3'>
						<Box className='w-10 h-10 bg-button rounded-full flex items-center justify-center text-white'>
							<User className='w-5 h-5' />
						</Box>
						<Box className='hidden sm:block'>
							<p className='text-sm font-medium text-primaryText'>
								{user?.name || 'Admin User'}
							</p>
							<p className='text-xs text-gray-500'>
								{user?.email || 'admin@example.com'}
							</p>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default AdminHeader;

