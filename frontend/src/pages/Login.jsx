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

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userID = localStorage.getItem("userID");
    const role = localStorage.getItem("role");
  
    if (username) {
      if (role === "admin") {
        navigate("/adminpage");
      } else {
        navigate("/homepage");
      }
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!email || !password) {
          handleError("All fields (username, email, password) are required.");
          return;
        }
        if (!validateEmail(email)) {
          handleError("Please enter a valid email address.");
          return;
        }

    try {
      const response = await login({ email, password }).unwrap(); 
      const { username, userID , role, friends, friendRequests , success} = response;
      
      if (success) {

        dispatch(setUser({ username, userID, role , friends, friendRequests}))

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
      handleError("Error please try again "+ err?.data?.message);
      console.log("Error :", err?.data?.message);
     
     }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen px-20">
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-black">Welcome</p>
        <p className="text-lg text-gray-500">We are glad to see you back with us</p>
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
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            autoComplete="current-password"
            className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            &#x1F512;
          </span>
        </div>
        <div className="text-center">
              <Link to="/resetPassword" className="text-sm text-gray-500">Forgot Password?? Click Here</Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
        >
          {isLoading ? "Logging In..." : "Login"}
        </button>
      </form>
  
      <div className="text-lg font-semibold text-black">
        Login <span className="font-normal text-gray-500">with Others</span>
      </div>
  
      <div className="w-full max-w-sm">
        <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-lg shadow-sm">
          <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
          <span className="text-black font-medium">Login with <span className="font-bold">google</span></span>
        </button>
      </div>

      <div className="text-center">
              <Link to="/signup" className="text-l text-gray-500">Don't have an Account?? Click Here</Link>
      </div>
    </div>
  
    <div className="ml-20">
      <img src={RectangleImage} alt="google" className="rounded-lg shadow-lg" />
    </div>

    <ToastContainer />
  </div>
  );
};
