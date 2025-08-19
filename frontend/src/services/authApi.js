import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = 'http://localhost:8080/main';

export const authApi = createApi({
  reducerPath: 'auth', 
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials : 'include' ,
    // prepareHeaders: (headers) => {
    //   // Get the token from localStorage
    //   const token = localStorage.getItem('accessToken');
      
    //   if (token) {
    //     headers.set('Authorization', `Bearer ${token}`);  // Add token to Authorization header
    //   }

    //   return headers;
    // },
  }),

  
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/signup', 
        method: 'POST',
        body: { username, email, password }, 
      }),
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/login',
        method: 'POST',
        body: { email, password },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/logout', 
        method: 'POST',
       
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/reset-password', 
        method: 'POST',
        body: { email }, 
      }),
    }),

    updatePassword: builder.mutation({
      query: ({ resetToken, password }) => ({
        url: `/update-password/${resetToken}`,  
        method: 'POST',
        body: { password },  
      }),
    }),

    jwtVerify: builder.query({
      query: () => ({
        url: '/verify', 
        method: 'POST',
      }),
    }),

  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation , useResetPasswordMutation ,useUpdatePasswordMutation , useJwtVerifyQuery } = authApi;
