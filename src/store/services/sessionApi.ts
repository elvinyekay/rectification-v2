import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {BaseQueryFn, FetchArgs} from '@reduxjs/toolkit/query';
import {setCredentials, logout as logoutAction} from "../slices/authSlice.ts";
import {RootState} from "../index.ts";
import {User} from "../../types/auth.ts";
import {mockUsers} from "../../api/_data/mockUsers.ts";

interface LoginRequest {
    email: string,
    password: string
}

interface LoginResponse {
    token: string,
    user: User
}

const realBaseQuery = fetchBaseQuery({
    baseUrl: '/api/sessionApi',
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
});

const mockBaseQuery: BaseQueryFn<string | FetchArgs, unknown, unknown> = async (args, api) => {
    const url = typeof args === 'string' ? args : args.url;
    const method = typeof args === 'string' ? 'GET' : (args.method || 'GET');
    const body = typeof args === 'string' ? undefined : (args.body as unknown);

    // yalnız DEV rejimində mockla
    const useMock = import.meta.env.DEV;

    if (useMock && url.startsWith('auth/')) {
        // ---- /auth/login
        if (url === 'auth/login' && method === 'POST') {
            const {email, password} = body as LoginRequest;
            const found = mockUsers.find(u => u.email === email && u.password === password);
            if (!found) {
                return {error: {status: 401, data: {message: 'Invalid credentials'}}};
            }
            const token = `mock-${found.role}-token`;
            const user: User = {id: found.id, name: found.name, role: found.role};
            return {data: {token, user} satisfies LoginResponse};
        }

        // ---- /auth/me
        if (url === '/auth/me' || url === 'auth/me') {
            const state = api.getState() as RootState;
            if (!state.auth.user) {
                return {error: {status: 401, data: {message: 'Not authenticated'}}};
            }
            return {data: state.auth.user as User};
        }
    }

    // mock örtmədiyi hallarda real fetch-ə düş
    return realBaseQuery(args, api, {});
};

export const sessionApi = createApi({
    reducerPath: "sessionApi" as const,
    baseQuery: mockBaseQuery,
    //     fetchBaseQuery({
    //     baseUrl: "/api/sessionApi",
    //     prepareHeaders: (headers, {getState}) => {
    //         const token = (getState() as RootState).auth.token;
    //         if (token) headers.set("Authorization", `Bearer ${token}`);
    //         return headers;
    //     },
    // }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                const {data} = await queryFulfilled;
                dispatch(setCredentials(data));
            },
        }),
        me: builder.query<User, void>({
            query: () => '/auth/me',
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    dispatch(logoutAction());
                }
            },
        }),
    }),
});

export const {useLoginMutation, useMeQuery, useLogoutMutation} = sessionApi;






