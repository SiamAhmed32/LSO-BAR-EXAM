import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { URL } from "../constants";

const tags = ["brand"];

// src/store/types.ts
export interface AuthState {
  token: string | null;
}

export interface RootState {
  auth: AuthState;
  // other slices of state
}

export const guestMainApi = createApi({
  reducerPath: "guestMainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.api}/app-api`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;

      const token = state.auth?.token;
      if (token) {
        headers.set("authorization", token);
      }
    },
  }),
  tagTypes: tags,
  endpoints: () => ({}),
});

export default guestMainApi;
