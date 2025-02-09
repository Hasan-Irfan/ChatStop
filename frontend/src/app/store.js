import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { requestApi } from '../services/requestApi';
import { messageApi } from '../services/messageApi';
import userReducer from '../services/userSlice';
import socketReducer from '../services/socketSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,   
    socket: socketReducer, 
    [authApi.reducerPath]: authApi.reducer, // Add authApi slice reducer
    [requestApi.reducerPath]: requestApi.reducer, // Add requestApi slice reducer
    [messageApi.reducerPath]: messageApi.reducer, // Add messageApi slice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)  // Add middleware for authApi
      .concat(requestApi.middleware) // Add middleware for requestApi
      .concat(messageApi.middleware), // Add middleware for messageApi
  // Redux DevTools extension is enabled by default in development
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development only
});
