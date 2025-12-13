import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/store/provider/ReduxProvider';
import { UserProvider } from '@/components/context/UserContext';

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
					</UserProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
