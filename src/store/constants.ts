export const TOKEN_NAME: string = process.env.NEXT_PUBLIC_TOKEN_NAME || 'DD_TOKEN_ONE';
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

export const currencySign = 'BDT';

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
``;
export const buttonFontSize = {
	md: '14px',
};

export const hintStores = [
	{
		storeName: 'DDONG',
		location: 'DDONG, BLOCK - D, House #71, Rd No. 11, Dhaka 1212',
		phone: '+88017',
		email: 'info@ddong.com',
		mapLink: '',
	},
	// {
	// 	storeName: 'HINT - Dhanmondi',
	// 	location: 'House 15/A, Road 27, Dhanmondi, Dhaka',
	// 	phone: '+8801712345680',
	// 	email: 'dhanmondi@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/place/15%2FA+Road+No+16,+Dhaka+1207/@23.7549938,90.3711786,17z/data=!3m1!4b1!4m6!3m5!1s0x3755bf533e780121:0x735abcb3a7e2563a!8m2!3d23.7549889!4d90.3737535!16s%2Fg%2F11f3bh7mjq?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
	// {
	// 	storeName: 'HINT - Uttara',
	// 	location: 'Sector 4, Road 7, Uttara, Dhaka',
	// 	phone: '+8801712345681',
	// 	email: 'uttara@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/search/Sector+4,+Road+7,+Uttara,+Dhaka/@23.8633141,90.3983045,18z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
	// {
	// 	storeName: 'HINT - Mirpur',
	// 	location: 'Plot 3, Road 2, Mirpur DOHS, Dhaka',
	// 	phone: '+8801712345682',
	// 	email: 'mirpur@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/place/Hilsa+Security+Limited/@23.8342,90.3647679,17z/data=!3m1!4b1!4m6!3m5!1s0x3754fd54a34dc02b:0x47f661d57f03a989!8m2!3d23.8341951!4d90.3673428!16s%2Fg%2F11q461_45q?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
	// {
	// 	storeName: 'HINT - Mohammadpur',
	// 	location: 'Block C, Tajmahal Road, Mohammadpur, Dhaka',
	// 	phone: '+8801712345683',
	// 	email: 'mohammadpur@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/place/Tajmahal+Rd,+Dhaka/@23.7646879,90.3595787,17z/data=!3m1!4b1!4m6!3m5!1s0x3755c0a7a8528867:0x83d108bb3ecc15be!8m2!3d23.764683!4d90.3621536!16s%2Fg%2F11f3n6jyhq?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
	// {
	// 	storeName: 'HINT - Badda',
	// 	location: 'Shahjadpur, Pragati Sarani, Badda, Dhaka',
	// 	phone: '+8801712345684',
	// 	email: 'badda@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/search/Shahjadpur,+Pragati+Sarani,+Badda,+Dhaka/@23.7888867,90.4196529,16z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
	// {
	// 	storeName: 'HINT - Bashundhara',
	// 	location: 'Block A, Bashundhara R/A, Dhaka',
	// 	phone: '+8801712345685',
	// 	email: 'bashundhara@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/place/Block+A,+Dhaka/@23.8136877,90.419272,15z/data=!3m1!4b1!4m6!3m5!1s0x3755c64a50afc947:0x4df85319dc2eea6d!8m2!3d23.8136688!4d90.4295717!16s%2Fg%2F11t9kd1245?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
	// {
	// 	storeName: 'HINT - Motijheel',
	// 	location: 'Dilkusha C/A, Motijheel, Dhaka',
	// 	phone: '+8801712345686',
	// 	email: 'motijheel@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/search/Dilkusha+C%2FA,+Motijheel,+Dhaka/@23.728869,90.4148788,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
	// {
	// 	storeName: 'HINT - Paltan',
	// 	location: 'VIP Road, Purana Paltan, Dhaka',
	// 	phone: '+8801712345687',
	// 	email: 'paltan@bengalbespoke.com',
	// 	mapLink:
	// 		'https://www.google.com/maps/search/VIP+Road,+Purana+Paltan,+Dhaka/@23.7364774,90.4106192,17z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
	// },
];
