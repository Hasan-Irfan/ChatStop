import React, { useState ,useEffect} from "react";
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
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
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
    <div className="flex justify-center items-center h-screen w-screen px-20">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <p className="text-8xl font-bold text-black">Welcome</p>
          <p className="text-lg text-gray-500">
            We are glad to see you back with us
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Username"
              autoComplete="Username"
              className=" pl-8 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              &#x1F464;
            </span>
          </div>
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
          >
            {isLoading ? "Signing Up..." : "Register"}
          </button>
        </form>

        <div className="text-lg font-semibold text-black">
          Login <span className="font-normal text-gray-500">with Others</span>
        </div>

        <div className="w-full max-w-sm">
          <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-lg shadow-sm">
            <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-2" />
            <span className="text-black font-medium">
              Login with <span className="font-bold">google</span>
            </span>
          </button>
        </div>

        <div className="text-center">
          <Link to="/login" className="text-l text-gray-500">
            Already have an Account?? Click Here
          </Link>
        </div>
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
