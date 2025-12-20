import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { UserProvider } from '@/components/context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSession } from '@/lib/server/session';
import CartLoader from '@/components/shared/CartLoader';

export const metadata: Metadata = {
	title: 'LSO Bar Exam',
	description: 'Practice for the Law Society of Ontario Bar Exam with free and paid practice questions for Barrister and Solicitor exams.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getSession();

	return (
		<html lang='en'>
			<body className={`bg-primaryBg text-primaryText antialiased`}>
				<ReduxProvider>
					<UserProvider user={user}>
						<CartLoader />
						{children}
						<ToastContainer
							position="top-right"
							autoClose={3000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme="light"
						/>
					</UserProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
