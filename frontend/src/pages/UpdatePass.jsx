import React, { useState } from "react";
import { useUpdatePasswordMutation } from "../services/authApi";  // Import the mutation hook
import { useNavigate, useParams } from "react-router-dom"; // For getting URL params
import { handleSuccess, handleError } from "../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import RectangleImage from "../images/Rectangle 4.png";

export const UpdatePass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetToken } = useParams();  // Get the resetToken from the URL params
  const navigate = useNavigate();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation(); // Mutation hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      handleError("Passwords do not match!");
      return;
    }

    try {
      const response = await updatePassword({ resetToken, password }).unwrap();
      console.log(response);

      if (response?.success) {
        handleSuccess(response.message);  // Assuming the response has a success field and message
        navigate("/login");
      } else {
        handleError(response.message);
      }
    } catch (error) {
      handleError("Link Expired, Please try again");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen px-20">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <p className="text-7xl font-bold text-black">Reset Password</p>
          <p className="text-lg text-gray-500">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
          >
            {isLoading ? "Loading..." : "Update Password"}
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
