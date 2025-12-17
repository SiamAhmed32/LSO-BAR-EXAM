import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/server/session';
import AdminLayout from '@/components/Admin/AdminLayout';

export default async function AdminLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	// Redirect to login if not authenticated or not admin
	if (!session || session.role !== 'ADMIN') {
		redirect('/login');
	}

	return <AdminLayout>{children}</AdminLayout>;
}

