import React, { useState ,useEffect} from "react";
import { useResetPasswordMutation } from "../services/authApi"; // Import the RTK Query hook for signup
import { useNavigate } from "react-router-dom";
import RectangleImage from "../images/Rectangle 4.png";
import { handleSuccess, handleError } from "../utils/toastUtil";
import { ToastContainer } from "react-toastify";

export const ResetPass = () => {

  const [email, setEmail] = useState("");
  const navigate = useNavigate(); 
  const [resetPassword, { isLoading , error: isError}] = useResetPasswordMutation(); 

   useEffect(() => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        navigate("/homepage");
      }
    }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !email ) {
      handleError("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      handleError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await resetPassword({ email }).unwrap();
     console.log(response);
      if (response?.success) {
        handleSuccess(response.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if(isError) {
        handleError(response.error);
      }
    } catch (error) {
      console.log(error);
      handleError(error.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen px-20">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <p className="text-6xl font-bold text-black">Reset Password</p>
          <p className="text-lg text-gray-500">
            Enter Email to Reset your Password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        
          <div className="relative">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              autoComplete="Email"
              className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              &#x2709;
            </span>
          </div>
       
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
          >
            {isLoading ? "Loading..." : "Reset Password"}
          </button>
        </form>

        
      </div>

      <div className="ml-20">
        <img
          src={RectangleImage}
          alt="google"
          className="rounded-lg shadow-lg"
        />
      </div>

      <ToastContainer />
    </div>
  );
};
