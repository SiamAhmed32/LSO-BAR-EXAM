import { TOKEN_NAME, URL } from '@/lib/constants';
import { LoginBodyType, LoginPayloadType } from './types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get BASE_URL with proper fallback - ensure it's always a valid backend URL
const envBackend = process.env.NEXT_PUBLIC_BACKEND;
const fallbackUrl = 'http://localhost:5000';
const BASE_URL = envBackend || URL.api || fallbackUrl;

// Note: If using Next.js API routes, localhost:3000 is correct
// If using a separate backend server, use a different port (e.g., localhost:5000)

console.log('AuthApi - NEXT_PUBLIC_BACKEND env:', envBackend);
console.log('AuthApi - URL.api:', URL.api);
console.log('AuthApi - Final BASE_URL:', BASE_URL);

const tags = ['self'];

// src/store/types.ts
export interface AuthState {
	token: string | null;
}

export interface RootState {
	auth: AuthState;
	// other slices of state
}


export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}`,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state?.auth?.token || localStorage.getItem(TOKEN_NAME);
			// console.log(token);

			if (token) {
				headers.set('Authorization', `${token}`);
			}
		},
	}),
	tagTypes: tags,
	endpoints: builder => ({
		// ✅ login uses Next.js API route
		login: builder.mutation<LoginPayloadType, LoginBodyType>({
			query: ({ email, password }) => ({
				url: `/api/auth/login`,
				method: 'POST',
				body: { email, password },
			}),
			invalidatesTags: ['self'],
		}),

		// ✅ register uses Next.js API route (signup) and maps username to name
		register: builder.mutation<any, any>({
			query: ({ username, email, password }) => ({
				url: `/api/auth/signup`,
				method: 'POST',
				body: { name: username, email, password }, // Map username to name for API
			}),
			invalidatesTags: ['self'],
		}),

		updatePassword: builder.mutation<any, any>({
			query: body => ({
				url: `auth/change-password`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['self'],
		}),
		getSelf: builder.query<any, any>({
			query: () => ({
				url: `user-api/auth/self`,
			}),
			providesTags: ['self'],
		}),
		getMyOrders: builder.query<any, any>({
			query: () => ({
				url: `/user-api/orders`,
			}),
			providesTags: ['self'],
		}),
		getSingleOrder: builder.query<any, string>({
			query: orderId => ({
				url: `/user-api/orders/${orderId}`,
			}),
			providesTags: ['self'],
		}),
		updateSelf: builder.mutation<any, any>({
			query: body => ({
				url: `/user-api/auth/self`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['self'],
		}),
		placeOrder: builder.mutation<any, any>({
			query: body => ({
				url: `auth/order`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['self'],
		}),
		updatePreferences: builder.mutation<any, any>({
			query: ({ field, preferences }) => ({
				url: `auth/update/preferences`,
				method: 'PUT',
				body: { field, preferences },
			}),
			invalidatesTags: (result, error, { field, preferences }) => [
				field,
				'self',
			],
		}),
		updatePassord: builder.mutation<any, any>({
			query: ({ field, preferences }) => ({
				url: `auth/update/password`,
				method: 'PUT',
				body: { field, preferences },
			}),
			invalidatesTags: (result, error, { field, preferences }) => [
				field,
				'self',
			],
		}),

		requestPasswordChange: builder.mutation({
			query: ({ email }) => ({
				url: `auth/request-password-change`, // ✅ unchanged
				method: 'POST',
				body: { email },
			}),
		}),
		verifyToken: builder.query({
			query: ({ token }) => ({
				url: `auth/verify-reset-token/${token}`, // ✅ unchanged
				method: 'GET',
			}),
		}),
		resetPassword: builder.mutation({
			query: ({ token, password }) => ({
				url: `auth/reset`, // ✅ unchanged
				method: 'POST',
				body: { token, password },
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useGetSelfQuery,
	useUpdatePreferencesMutation,
	useRegisterMutation,
	useUpdatePasswordMutation,
	useUpdateSelfMutation,
	useUpdatePassordMutation,
	useRequestPasswordChangeMutation,
	useVerifyTokenQuery,
	useResetPasswordMutation,
	usePlaceOrderMutation,
	useGetMyOrdersQuery,
	useGetSingleOrderQuery,
} = authApi;

export default authApi;
