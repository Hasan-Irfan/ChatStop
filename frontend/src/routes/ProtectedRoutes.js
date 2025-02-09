import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useJwtVerifyQuery } from '../services/authApi';
export const ProtectedRoutes = () => {

    const { data , isLoading} = useJwtVerifyQuery();

    if(isLoading) return <div>Loading...</div>;

     return data && data?.success ? <Outlet /> : <Navigate to="/login" />;
}
