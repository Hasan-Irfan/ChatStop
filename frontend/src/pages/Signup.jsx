import React, { useState, useEffect } from "react";
import { useSignupMutation } from "../services/authApi"; // Import the RTK Query hook for signup
import { Link, useNavigate } from "react-router-dom";
import RectangleImage from "../images/Rectangle 4.png";
import { handleSuccess, handleError } from "../utils/toastUtil";
import { ToastContainer } from "react-toastify";

export const Signup = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Create navigate function using useNavigate

  const [signup, { isLoading, error }] = useSignupMutation(); // Hook to call signup mutation

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      navigate("/homepage");
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.\_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      handleError("All fields (username, email, password) are required.");
      return;
    }
    if (!validateEmail(email)) {
      handleError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      handleError("Please enter a password of at least 6 characters.");
      return;
    }
    try {
      const response = await signup({ username, email, password }).unwrap();

      console.log(response.success);
      if (response.success) {
        handleSuccess(response.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (e) {
      if (e.status === 409) {
        handleError(e.data.message);
      }
      console.log(e);
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 lg:space-y-6">
            
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Username"
                autoComplete="Username"
                className="pl-10 sm:pl-12 w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                &#x1F464;
              </span>
            </div>

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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50"
            >
              {isLoading ? "Signing Up..." : "Register"}
            </button>
          </form>

          {/* Social Login Section */}
          <div className="text-center mt-6 lg:mt-8">
            <div className="text-base sm:text-lg font-semibold text-black mb-4">
              Login <span className="font-normal text-gray-500">with Others</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-sm sm:text-base text-gray-500 hover:text-gray-700 transition-colors">
              Already have an Account?? Click Here
            </Link>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full lg:w-auto lg:flex-1 flex justify-center lg:justify-end order-first lg:order-last">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <img
              src={RectangleImage}
              alt="Signup illustration"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
