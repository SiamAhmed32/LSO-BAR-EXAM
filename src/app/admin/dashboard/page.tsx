'use client';

import React from 'react';
import { Box } from '@/components/reusables';
import {
	Users,
	DollarSign,
	ShoppingCart,
	TrendingUp,
	FileText,
	Package,
	BarChart3,
	Activity,
} from 'lucide-react';

const AdminDashboard = () => {
	const stats = [
		{
			title: 'Total Revenue',
			value: '$45,231',
			change: '+20.1%',
			icon: DollarSign,
			color: 'bg-green-500',
		},
		{
			title: 'Total Users',
			value: '2,350',
			change: '+15.3%',
			icon: Users,
			color: 'bg-blue-500',
		},
		{
			title: 'Orders',
			value: '1,234',
			change: '+12.5%',
			icon: ShoppingCart,
			color: 'bg-purple-500',
		},
		{
			title: 'Products',
			value: '856',
			change: '+8.2%',
			icon: Package,
			color: 'bg-orange-500',
		},
	];

	const recentActivities = [
		{
			id: 1,
			action: 'New order received',
			user: 'John Doe',
			time: '2 minutes ago',
			type: 'order',
		},
		{
			id: 2,
			action: 'User registered',
			user: 'Jane Smith',
			time: '15 minutes ago',
			type: 'user',
		},
		{
			id: 3,
			action: 'Product updated',
			user: 'Admin',
			time: '1 hour ago',
			type: 'product',
		},
		{
			id: 4,
			action: 'Payment received',
			user: 'Mike Johnson',
			time: '2 hours ago',
			type: 'payment',
		},
	];

	return (
		<Box className='p-6 space-y-6'>
			{/* Page Header */}
			<Box className='mb-8'>
				<h1 className='text-3xl font-bold text-primaryText mb-2'>
					Dashboard Overview
				</h1>
				<p className='text-gray-600'>
					Welcome back! Here's what's happening with your business today.
				</p>
			</Box>

			{/* Stats Grid */}
			<Box className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Box
							key={index}
							className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'
						>
							<Box className='flex items-center justify-between mb-4'>
								<Box
									className={`${stat.color} p-3 rounded-lg text-white`}
								>
									<Icon className='w-6 h-6' />
								</Box>
								<span className='text-green-600 text-sm font-semibold'>
									{stat.change}
								</span>
							</Box>
							<h3 className='text-gray-600 text-sm mb-1'>{stat.title}</h3>
							<p className='text-2xl font-bold text-primaryText'>
								{stat.value}
							</p>
						</Box>
					);
				})}
			</Box>

			{/* Charts and Activities Row */}
			<Box className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Chart Section */}
				<Box className='lg:col-span-2 bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
					<Box className='flex items-center justify-between mb-6'>
						<h2 className='text-xl font-semibold text-primaryText'>
							Revenue Overview
						</h2>
						<Box className='flex items-center gap-2 text-sm text-gray-600'>
							<BarChart3 className='w-4 h-4' />
							<span>Last 7 days</span>
						</Box>
					</Box>
					<Box className='h-64 flex items-center justify-center bg-gray-50 rounded-lg'>
						<Box className='text-center'>
							<Activity className='w-12 h-12 text-gray-400 mx-auto mb-2' />
							<p className='text-gray-500'>Chart visualization</p>
							<p className='text-sm text-gray-400 mt-1'>
								Integrate your chart library here
							</p>
						</Box>
					</Box>
				</Box>

				{/* Recent Activities */}
				<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
					<Box className='flex items-center justify-between mb-6'>
						<h2 className='text-xl font-semibold text-primaryText'>
							Recent Activity
						</h2>
						<Activity className='w-5 h-5 text-gray-400' />
					</Box>
					<Box className='space-y-4'>
						{recentActivities.map((activity) => (
							<Box
								key={activity.id}
								className='border-l-4 border-button pl-4 py-2'
							>
								<p className='text-sm font-medium text-primaryText'>
									{activity.action}
								</p>
								<p className='text-xs text-gray-500 mt-1'>
									{activity.user} • {activity.time}
								</p>
							</Box>
						))}
					</Box>
					<button className='mt-4 w-full text-sm text-button hover:text-button-dark font-medium'>
						View all activities →
					</button>
				</Box>
			</Box>

			{/* Quick Actions */}
			<Box className='bg-primaryCard rounded-lg shadow-sm border border-gray-200 p-6'>
				<h2 className='text-xl font-semibold text-primaryText mb-4'>
					Quick Actions
				</h2>
				<Box className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left'>
						<FileText className='w-6 h-6 text-button mb-2' />
						<p className='text-sm font-medium text-primaryText'>
							Add Product
						</p>
					</button>
					<button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left'>
						<Users className='w-6 h-6 text-button mb-2' />
						<p className='text-sm font-medium text-primaryText'>
							Manage Users
						</p>
					</button>
					<button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left'>
						<ShoppingCart className='w-6 h-6 text-button mb-2' />
						<p className='text-sm font-medium text-primaryText'>
							View Orders
						</p>
					</button>
					<button className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left'>
						<TrendingUp className='w-6 h-6 text-button mb-2' />
						<p className='text-sm font-medium text-primaryText'>
							Analytics
						</p>
					</button>
				</Box>
			</Box>
		</Box>
	);
};

export default AdminDashboard;

