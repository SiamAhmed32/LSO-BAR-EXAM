import { TOKEN_NAME, URL } from '@/lib/constants';
import { LoginBodyType, LoginPayloadType } from './types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// For Next.js API routes, use empty string to use current origin (works for both local and deployment)
// This ensures:
// - Locally: /api/auth/login → http://localhost:3000/api/auth/login
// - Deployment: /api/auth/login → https://lso-bar-exam.vercel.app/api/auth/login
// Empty string makes URLs relative, which automatically uses the current origin
const BASE_URL = '';

// Note: Other endpoints in this file (like auth/change-password, user-api/*) may be legacy or external APIs
// If they need a different baseUrl, they should be updated to use full URLs or moved to a separate API service

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
		baseUrl: BASE_URL, // Empty string = use current origin (works for both local and deployment)
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
