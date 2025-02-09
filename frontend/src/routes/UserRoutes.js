import React from "react";
import { useEffect , useState} from "react";
import { Navigate, Outlet } from "react-router-dom";
export const UserRoutes = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
      setLoading(false);  // Once role is fetched, stop loading
    }, []);
  
    if (loading) {
      // Optional: show a loading indicator if needed
      return <div>Loading...</div>;
    }
  
    return role === 'user' ? <Outlet /> : <Navigate to="/login" />;
};
