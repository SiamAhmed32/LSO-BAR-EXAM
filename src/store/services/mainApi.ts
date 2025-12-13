
import { URL } from '@/lib/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tags = [
	'brand',
	'brands',
	'category',
	'categories',
	'collection',
	'collections',
	'count',
	'coupon',
	'coupons',
	'filter',
	'filters',
	'organizatin',
	'organizations',
	'product',
	'products',
	'role',
	'roles',
	'scan',
	'self',
	'sum',
	'tag',
	'tags',
	'upload',
	'uploads',
	'user',
	'users',
];

// src/store/types.ts
export interface AuthState {
	token: string | null;
}

export interface RootState {
	auth: AuthState;
	// other slices of state
}

export const mainApi = createApi({
	reducerPath: 'mainApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${URL.api}`,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			// const token = state.auth?.token;
			const token = process.env.NEXT_PUBLIC_TOKEN;

			if (token) {
				 headers.set('Authorization', `Bearer ${token}`);
			}
		},
	}),
	tagTypes: tags,
	endpoints: () => ({}),
});

export default mainApi;
