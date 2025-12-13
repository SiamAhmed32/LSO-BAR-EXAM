export const TOKEN_NAME: string =
	process.env.NEXT_PUBLIC_TOKEN_NAME || 'TEST_TOKEN_ECOM_ONE';
export const BASE_LIMIT: number = 10;
export const URL: any = {
	api: process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000',
};
export const REFRESH_TOKEN: string =
	process.env.NEXT_PUBLIC_REFRESH || 'TEST_REFRESH_ECOM_ONE';

export const SECTION_PADDING = '100px';
export const takaSign = '৳';
export const dollarSign = '$';

export const propertyStatus = [
	{ name: 'For Buy', _id: 'buy' },
	{ name: 'For Sale', _id: 'sale' },
	{ name: 'For Rent', _id: 'rent' },
];