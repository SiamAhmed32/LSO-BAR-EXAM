'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '../shared';
import { Menu, Bell, Search, User } from 'lucide-react';
import AdminCustomButton from './AdminCustomButton';
import { useUser } from '../context/UserContext';
import NotificationDropdown from './NotificationDropdown';

interface AdminHeaderProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
	sidebarOpen,
	setSidebarOpen,
}) => {
	const { user } = useUser();
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		// Fetch unread count periodically
		const fetchUnreadCount = async () => {
			try {
				const response = await fetch('/api/admin/notifications?limit=1', {
					method: 'GET',
					credentials: 'include',
				});

				if (response.ok) {
					const result = await response.json();
					setUnreadCount(result.data.unreadCount);
				}
			} catch (error) {
				console.error('Error fetching unread count:', error);
			}
		};

		fetchUnreadCount();
		const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<Box className='bg-primaryCard border-b border-gray-200 px-6 py-4 relative'>
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
					{/* <Box className='hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-64'>
						<Search className='w-4 h-4 text-gray-400' />
						<input
							type='text'
							placeholder='Search...'
							className='bg-transparent border-none outline-none text-sm flex-1'
						/>
					</Box> */}
				</Box>

				{/* Right Section */}
				<Box className='flex items-center gap-4'>
					{/* Notifications */}
					<Box className='relative'>
						<AdminCustomButton
							variant='icon'
							className='relative text-gray-600 hover:text-primaryText'
							onClick={() => setNotificationOpen(!notificationOpen)}
						>
							<Bell className='w-5 h-5' />
							{unreadCount > 0 && (
								<span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center'>
									{unreadCount > 99 ? '99+' : unreadCount}
								</span>
							)}
						</AdminCustomButton>
						<NotificationDropdown
							isOpen={notificationOpen}
							onClose={() => setNotificationOpen(false)}
							onUnreadCountChange={setUnreadCount}
						/>
					</Box>

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
								{user?.email || 'lsobarexamteam@gmail.com'}
							</p>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default AdminHeader;

