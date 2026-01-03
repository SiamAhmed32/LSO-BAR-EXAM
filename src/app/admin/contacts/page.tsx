'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@/components/shared';
import { Mail, Calendar, User, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { AdminTable, Column, TableSkeleton, AdminCustomButton, AdminDialog } from '@/components/Admin';
import { toast } from 'react-toastify';

interface Contact {
	id: string;
	name: string;
	email: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
}

interface ContactsResponse {
	contacts: Contact[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

const AdminContactsPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<any>(null);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const pageLimit = 10;

	const fetchContacts = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`/api/contact?page=${currentPage}&limit=${pageLimit}`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to load contacts');
			}

			const result = await response.json();
			const data: ContactsResponse = result.data;
			setContacts(data.contacts);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Error fetching contacts:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to load contacts');
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, pageLimit]);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleRowClick = (contact: Contact) => {
		setSelectedContact(contact);
		setIsModalOpen(true);
		// Mark as read if not already read
		if (!contact.isRead) {
			markAsRead(contact.id);
		}
	};

	const markAsRead = async (contactId: string) => {
		try {
			const response = await fetch(`/api/contact/${contactId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ isRead: true }),
			});

			if (response.ok) {
				// Update the contact in the list
				setContacts((prev) =>
					prev.map((contact) =>
						contact.id === contactId ? { ...contact, isRead: true } : contact
					)
				);
				if (selectedContact?.id === contactId) {
					setSelectedContact({ ...selectedContact, isRead: true });
				}
			}
		} catch (error) {
			console.error('Error marking contact as read:', error);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const columns: Column<Contact>[] = [
		{
			key: 'name',
			header: 'Name',
			render: (item) => (
				<Box className='flex items-center gap-3'>
					<Box className='w-10 h-10 bg-button rounded-full flex items-center justify-center text-white'>
						<User className='w-5 h-5' />
					</Box>
					<Box className='flex flex-col'>
						<span className='text-sm font-medium text-primaryText'>{item.name}</span>
						<span className='text-xs text-gray-500'>{item.email}</span>
					</Box>
				</Box>
			),
		},
		{
			key: 'message',
			header: 'Message',
			render: (item) => (
				<Box className='flex items-center gap-2 max-w-md'>
					<MessageSquare className='w-4 h-4 text-gray-400 flex-shrink-0' />
					<span className='text-sm text-gray-700 truncate'>
						{item.message.length > 100
							? `${item.message.substring(0, 100)}...`
							: item.message}
					</span>
				</Box>
			),
		},
		{
			key: 'isRead',
			header: 'Status',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					{item.isRead ? (
						<>
							<Eye className='w-4 h-4 text-green-600' />
							<span className='text-sm text-green-700 font-medium'>Read</span>
						</>
					) : (
						<>
							<EyeOff className='w-4 h-4 text-blue-600' />
							<span className='text-sm text-blue-700 font-medium'>Unread</span>
						</>
					)}
				</Box>
			),
		},
		{
			key: 'createdAt',
			header: 'Submitted',
			render: (item) => (
				<Box className='flex items-center gap-2'>
					<Calendar className='w-4 h-4 text-gray-400' />
					<span className='text-sm text-gray-600'>{formatDate(item.createdAt)}</span>
				</Box>
			),
		},
	];

	return (
		<Box className='p-6'>
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2 flex items-center gap-3'>
					<Mail className='w-8 h-8' />
					Contact Submissions
				</h1>
				<p className='text-gray-600'>View and manage all contact form submissions</p>
			</Box>

			{isLoading ? (
				<TableSkeleton columns={columns.length} rows={5} />
			) : (
				<AdminTable
					data={contacts}
					columns={columns}
					emptyMessage='No contact submissions found'
					pagination={pagination}
					onPageChange={handlePageChange}
					fixedHeight={true}
					tableHeight='600px'
					onRowClick={handleRowClick}
				/>
			)}

			{/* Contact Details Modal */}
			<AdminDialog
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedContact(null);
				}}
				title='Contact Details'
			>
				{selectedContact && (
					<Box className='space-y-4'>
						<Box className='grid grid-cols-2 gap-4'>
							<Box>
								<label className='text-sm font-semibold text-gray-700'>Name</label>
								<p className='text-sm text-gray-900 mt-1'>{selectedContact.name}</p>
							</Box>
							<Box>
								<label className='text-sm font-semibold text-gray-700'>Email</label>
								<p className='text-sm text-gray-900 mt-1'>{selectedContact.email}</p>
							</Box>
						</Box>
						<Box>
							<label className='text-sm font-semibold text-gray-700'>Message</label>
							<Box className='mt-1 p-3 bg-gray-50 rounded-md border border-gray-200'>
								<p className='text-sm text-gray-900 whitespace-pre-wrap'>
									{selectedContact.message}
								</p>
							</Box>
						</Box>
						<Box className='grid grid-cols-2 gap-4'>
							<Box>
								<label className='text-sm font-semibold text-gray-700'>Submitted</label>
								<p className='text-sm text-gray-600 mt-1'>
									{formatDate(selectedContact.createdAt)}
								</p>
							</Box>
							<Box>
								<label className='text-sm font-semibold text-gray-700'>Status</label>
								<Box className='mt-1'>
									{selectedContact.isRead ? (
										<span className='inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700'>
											<Eye className='w-3 h-3' />
											Read
										</span>
									) : (
										<span className='inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700'>
											<EyeOff className='w-3 h-3' />
											Unread
										</span>
									)}
								</Box>
							</Box>
						</Box>
						{!selectedContact.isRead && (
							<Box className='pt-4 border-t border-gray-200'>
								<AdminCustomButton
									onClick={() => markAsRead(selectedContact.id)}
									variant='primary'
									size='md'
									className='w-full'
								>
									Mark as Read
								</AdminCustomButton>
							</Box>
						)}
					</Box>
				)}
			</AdminDialog>
		</Box>
	);
};

export default AdminContactsPage;

