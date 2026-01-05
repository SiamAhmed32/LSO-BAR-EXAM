'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box } from '../shared';
import { cn } from '@/lib/utils';
import {
	Bell,
	User,
	FileText,
	ShoppingCart,
	CreditCard,
	GraduationCap,
	MessageSquare,
	Activity,
	X,
	Check,
	Clock,
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Notification {
	id: string;
	activityId: string;
	activityType: string;
	action: string;
	description: string;
	userId?: string;
	userEmail?: string;
	metadata?: any;
	createdAt: string;
	isRead: boolean;
}

interface NotificationDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	onUnreadCountChange?: (count: number) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	isOpen,
	onClose,
	onUnreadCountChange,
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const fetchNotifications = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/admin/notifications?limit=50', {
				method: 'GET',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to load notifications');
			}

			const result = await response.json();
			setNotifications(result.data.notifications);
			const count = result.data.unreadCount;
			setUnreadCount(count);
			onUnreadCountChange?.(count);
		} catch (error) {
			console.error('Error fetching notifications:', error);
			toast.error('Failed to load notifications');
		} finally {
			setIsLoading(false);
		}
	}, [onUnreadCountChange]);

	useEffect(() => {
		if (isOpen) {
			fetchNotifications();
		}
	}, [isOpen, fetchNotifications]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);

	const toggleReadStatus = async (notificationId: string, currentStatus: boolean) => {
		try {
			const response = await fetch(`/api/admin/notifications/${notificationId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ isRead: !currentStatus }),
			});

			if (!response.ok) {
				throw new Error('Failed to update notification');
			}

			// Update local state
			setNotifications((prev) =>
				prev.map((n) =>
					n.id === notificationId
						? { ...n, isRead: !currentStatus }
						: n
				)
			);

			// Update unread count
			const newCount = currentStatus ? unreadCount + 1 : unreadCount - 1;
			setUnreadCount(newCount);
			onUnreadCountChange?.(newCount);
		} catch (error) {
			console.error('Error updating notification:', error);
			toast.error('Failed to update notification');
		}
	};

	const markAllAsRead = async () => {
		try {
			const response = await fetch('/api/admin/notifications', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to mark all notifications as read');
			}

			// Update all notifications to read
			setNotifications((prev) =>
				prev.map((n) => ({ ...n, isRead: true }))
			);

			// Reset unread count
			setUnreadCount(0);
			onUnreadCountChange?.(0);
			
			toast.success('All notifications marked as read');
		} catch (error) {
			console.error('Error marking all notifications as read:', error);
			toast.error('Failed to mark all notifications as read');
		}
	};

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'user':
				return User;
			case 'question':
				return FileText;
			case 'order':
				return ShoppingCart;
			case 'payment':
				return CreditCard;
			case 'exam_attempt':
				return GraduationCap;
			case 'contact':
				return MessageSquare;
			default:
				return Activity;
		}
	};

	const getActivityColor = (type: string) => {
		switch (type) {
			case 'user':
				return 'bg-blue-500';
			case 'question':
				return 'bg-green-500';
			case 'order':
				return 'bg-purple-500';
			case 'payment':
				return 'bg-yellow-500';
			case 'exam_attempt':
				return 'bg-indigo-500';
			case 'contact':
				return 'bg-pink-500';
			default:
				return 'bg-gray-500';
		}
	};

	const formatTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return 'Just now';
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)} minutes ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)} hours ago`;
		if (diffInSeconds < 604800)
			return `${Math.floor(diffInSeconds / 86400)} days ago`;
		return date.toLocaleDateString();
	};

	if (!isOpen) return null;

	return (
		<Box
			ref={dropdownRef}
			className='absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] flex flex-col'
		>
			{/* Header */}
			<Box className='p-4 border-b border-gray-200'>
				<Box className='flex items-center justify-between mb-3'>
					<h3 className='text-lg font-semibold text-primaryText'>Notifications</h3>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-primaryText transition-colors'
					>
						<X className='w-5 h-5' />
					</button>
				</Box>
				{unreadCount > 0 && (
					<button
						onClick={markAllAsRead}
						className='w-full text-xs text-primaryColor hover:text-buttonHover font-medium py-1.5 px-3 rounded-md hover:bg-primaryColor/10 transition-colors'
					>
						Mark all as read
					</button>
				)}
			</Box>

			{/* Notifications List */}
			<Box className='flex-1 overflow-y-auto scrollbar-hide'>
				{isLoading ? (
					<Box className='divide-y divide-gray-100'>
						{Array.from({ length: 5 }).map((_, index) => (
							<div
								key={index}
								className='p-3 animate-pulse'
							>
								<div className='flex items-start gap-2'>
									{/* Icon Skeleton */}
									<div className='w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0' />
									<div className='flex-1 min-w-0 space-y-1.5'>
										{/* Action Text Skeleton */}
										<div className='h-3 bg-gray-200 rounded w-3/4' />
										{/* Email Skeleton */}
										<div className='h-3 bg-gray-200 rounded w-1/2' />
										{/* Time Skeleton */}
										<div className='flex items-center gap-1 mt-1'>
											<div className='w-3 h-3 bg-gray-200 rounded' />
											<div className='h-3 bg-gray-200 rounded w-20' />
										</div>
									</div>
									{/* Read Indicator Skeleton */}
									<div className='w-3.5 h-3.5 bg-gray-200 rounded-full flex-shrink-0 mt-0.5' />
								</div>
							</div>
						))}
					</Box>
				) : notifications.length === 0 ? (
					<Box className='p-8 text-center'>
						<Bell className='w-12 h-12 text-gray-300 mx-auto mb-2' />
						<p className='text-sm text-gray-500'>No notifications</p>
					</Box>
				) : (
					<Box className='divide-y divide-gray-100'>
						{notifications.map((notification) => {
							const Icon = getActivityIcon(notification.activityType);
							const colorClass = getActivityColor(notification.activityType);

							return (
								<Box
									key={notification.id}
									className={cn(
										'p-3 hover:bg-gray-50 transition-colors cursor-pointer',
										!notification.isRead && 'bg-blue-50'
									)}
									onClick={() => toggleReadStatus(notification.id, notification.isRead)}
								>
									<Box className='flex items-start gap-2'>
										<Box
											className={cn(
												`${colorClass} p-1.5 rounded-lg text-white flex-shrink-0`
											)}
										>
											<Icon className='w-3.5 h-3.5' />
										</Box>
										<Box className='flex-1 min-w-0'>
											<Box className='flex items-start justify-between gap-2'>
												<Box className='flex-1'>
													<p
														className={cn(
															'text-xs font-medium leading-tight',
															notification.isRead
																? 'text-gray-700'
																: 'text-primaryText font-semibold'
														)}
													>
														{notification.action}
													</p>
													<p className='text-xs text-gray-600 mt-0.5 line-clamp-2'>
														{notification.description}
													</p>
													{notification.userEmail && (
														<div className='flex items-center gap-2 mt-0.5'>
															<p className='text-xs text-gray-500 truncate'>
																{notification.userEmail}
															</p>
															<span className='text-xs text-gray-400'>•</span>
															<Box className='flex items-center gap-1'>
																<Clock className='w-3 h-3 text-gray-400' />
																<span className='text-xs text-gray-500'>
																	{formatTimeAgo(notification.createdAt)}
																</span>
															</Box>
														</div>
													)}
													{!notification.userEmail && (
														<Box className='flex items-center gap-1 mt-0.5'>
															<Clock className='w-3 h-3 text-gray-400' />
															<span className='text-xs text-gray-500'>
																{formatTimeAgo(notification.createdAt)}
															</span>
														</Box>
													)}
												</Box>
												<Box className='flex items-center gap-2 flex-shrink-0 pt-0.5'>
													{notification.isRead ? (
														<Check className='w-3.5 h-3.5 text-green-600' />
													) : (
														<div className='w-2 h-2 bg-blue-600 rounded-full' />
													)}
												</Box>
											</Box>
										</Box>
									</Box>
								</Box>
							);
						})}
					</Box>
				)}
			</Box>

			{/* Footer */}
			{notifications.length > 0 && (
				<Box className='p-3 border-t border-gray-200 bg-gray-50'>
					<p className='text-xs text-center text-gray-500'>
						Click on a notification to mark as {notifications.some(n => !n.isRead) ? 'read' : 'unread'}
					</p>
				</Box>
			)}
		</Box>
	);
};

export default NotificationDropdown;

