import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../services/authApi"; 
import { Link, useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from "../utils/toastUtil";
import RectangleImage from "../images/Rectangle 4.png";
import { ToastContainer } from "react-toastify";
import { setUser } from "../services/userSlice";
import { useDispatch } from "react-redux";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation(); 

  // Do not auto-redirect on visit; gating is handled by ProtectedRoutes

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.\_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      handleError("All fields (email, password) are required.");
      return;
    }
    if (!validateEmail(email)) {
      handleError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap(); 
      const { username, userID, role, email: userEmail, friends, friendRequests, profilePicture, success } = response;
      
      if (success) {
        dispatch(setUser({ username, userID, role, email: userEmail, friends, friendRequests, profilePicture }));

        console.log(response);
        handleSuccess(response.message);
        setTimeout(() => {
          if (role === "admin") {
            navigate("/adminpage");  // Redirect to admin page
          } else {
            navigate("/homepage");   // Redirect to user homepage
          }
        }, 2000);
      }
    } catch (err) {
      handleError("Error please try again " + err);
      console.log("Error :", err?.data?.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row justify-center items-center p-4 lg:px-20 bg-gray-50">
      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl gap-8 lg:gap-20">
        
        {/* Left Section - Form */}
        <div className="flex flex-col items-center w-full lg:w-auto lg:flex-1 max-w-md lg:max-w-lg">
          
          {/* Welcome Text */}
          <div className="text-center mb-6 lg:mb-8">
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black leading-tight">
              Welcome
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 mt-2">
              We are glad to see you back with us
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 lg:space-y-6">
            
            {/* Email Input */}
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                autoComplete="Email"
                className="pl-10 sm:pl-12 w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                &#x2709;
              </span>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                autoComplete="current-password"
                className="pl-10 sm:pl-12 w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                &#x1F512;
              </span>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link to="/resetPassword" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Forgot Password?? Click Here
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50"
            >
              {isLoading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* Social Login Section */}
          <div className="text-center mt-6 lg:mt-8">
            <div className="text-base sm:text-lg font-semibold text-black mb-4">
              Login <span className="font-normal text-gray-500">with Others</span>
            </div>
          </div>

          {/* Social Login Button (Commented) */}
          {/* 
          <div className="w-full">
            <button className="w-full flex items-center justify-center border border-gray-300 py-3 sm:py-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <img src="/google-icon.png" alt="Google" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span className="text-black font-medium text-sm sm:text-base">
                Login with <span className="font-bold">google</span>
              </span>
            </button>
          </div>
          */}

          {/* Signup Link */}
          <div className="text-center mt-4">
            <Link to="/signup" className="text-sm sm:text-base text-gray-500 hover:text-gray-700 transition-colors">
              Don't have an Account?? Click Here
            </Link>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full lg:w-auto lg:flex-1 flex justify-center lg:justify-end order-first lg:order-last">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <img
              src={RectangleImage}
              alt="Login illustration"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
