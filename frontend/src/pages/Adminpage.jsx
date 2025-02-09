import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../services/authApi";
import { handleSuccess } from "../utils/toastUtil";
import { ToastContainer } from "react-toastify";

export const Adminpage = () => {


  const [loggedInUser, SetloggedInUser] = useState("");
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    SetloggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();

      console.log(response);

      if (response.success) {
        handleSuccess(response.message);
        setTimeout(() => {
          // localStorage.removeItem("accessToken");
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("role");
          navigate("/login"); // redirect to login page after logout
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{loggedInUser}</h2>
      <p>Welcome to the ADMINPAGE!</p>
      <button onClick={handleLogout}>Logout</button>
      <ToastContainer />
    </div>
  );
};
