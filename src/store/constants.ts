export const TOKEN_NAME: string = process.env.NEXT_PUBLIC_TOKEN_NAME || 'APP_TOKEN';
export const REFRESH_TOKEN: string = process.env.NEXT_PUBLIC_REFRESH || 'TEST_REFRESH_ECOM_ONE';

export const BASE_LIMIT: number = 10;

export const URL = {
	api: process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000',
};

export const PRIVACY_CONTAINER = { base: 4, md: '15vw' };

export const BORDER_COLOR = '#ccc';
export const COLOR_BORDER_COLOR = '#595959';
export const BORDER_COLOR_INVALID = 'red.400';
export const BORDER_BOTTOM_COLOR = '#ccc';
export const SUCCESS_ICON_COLOR = '#444';
export const FAIL_COLOR = '#FF0000';
export const WARNING_COLOR = '#FFFF00';
export const BLACK_COLOR = '#000';
export const WHITE_COLOR = '#fff';
export const TEXT_GRAY_COLOR = '#000';
const PADDING_TOAST_X = 2;

export const currencySign = 'USD';

export const toastStyle = {
	bg: 'black',

	color: 'white',
	borderRadius: '0',
	border: '1px solid black',
	fontFamily: 'Arial',
	fontSize: '14px',
	px: PADDING_TOAST_X,
	textAlign: 'center' as const,
};

export const favoritesToastStyle = {
	bg: 'black',
	color: 'white',
	borderRadius: '0',
	border: '1px solid white',
	fontFamily: 'Arial',
	px: PADDING_TOAST_X,
	fontSize: '14px',
	textAlign: 'center' as const,
};
export const toastErrStyle = {
	bg: 'white',
	color: 'red',
	borderRadius: '0',
	border: '1px solid red',
	fontFamily: 'Arial',
	px: PADDING_TOAST_X,
	fontSize: '14px',
	textAlign: 'center' as const,
};

export const color = {
	primary: '#131313',
	secondary: '#353535',
	overlay: 'blackAlpha.300',
};

export const sizes = {
	btnHeightLg: '44px',
	pageColorBox: '24px',
};

export const buttonFontSize = {
	md: '14px',
};

export const stores = [
	{
		storeName: 'Store Name',
		location: 'Your Store Address Here',
		phone: '+1 (555) 000-0000',
		email: 'store@example.com',
		mapLink: '',
	},
];
