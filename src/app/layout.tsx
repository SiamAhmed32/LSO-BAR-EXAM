import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { UserProvider } from '@/components/context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
	title: 'Frontend Template',
	description: 'A Next.js starter template',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`bg-primaryBg text-primaryText antialiased`}>
				<ReduxProvider>
					<UserProvider user={null}>
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
