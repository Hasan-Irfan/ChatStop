import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useLogoutMutation } from "../../services/authApi";
import { handleSuccess } from "../../utils/toastUtil";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import {
  logout as logoutFromSlice,
  updateFriendRequests,
} from "../../services/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetFriendRequestQuery, useHandleRequestMutation } from "../../services/requestApi";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRequests, setShowRequests] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();
  const [handleRequest] = useHandleRequestMutation(); 

  const { username, friendRequests = [] } = useSelector((state) => state.user); 

  // Fetch friend requests with polling interval (e.g., every 10 seconds)
  const { data, refetch } = useGetFriendRequestQuery(username, {
    skip: !username,
    pollingInterval: 10000, // Fetch every 10 seconds
  });

  // Update Redux store whenever new friend requests arrive
  useEffect(() => {
    if (data?.friendRequests) {
      dispatch(updateFriendRequests(data.friendRequests));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [username, navigate]);

  const handleLogout = async () => {
    try {
      dispatch(logoutFromSlice());
      const response = await logout().unwrap();

      if (response.success) {
        handleSuccess(response.message);
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFriendRequest = async (senderUsername, accept) => {
    if (!username) return;
    try {
      const response = await handleRequest({
        state: accept ? "accepted" : "rejected",
        senderUsername,
        receiverUsername: username,
      }).unwrap();

      if (response.success) {
        const updatedRequests = friendRequests.filter(
          (req) => req.sender !== senderUsername
        );
        dispatch(updateFriendRequests(updatedRequests));

        // Refetch friend requests to update the UI
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white border-b shadow-lg">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="logo flex items-center">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="rounded-full"
            />
          </div>
          <ul className="hidden md:flex gap-6 text-gray-600 text-lg font-medium">
            <li>
              <Link to="/homepage" className="hover:text-blue-500 transition">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => navigate("/chatpage")}
                className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Chatting
              </button>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowRequests(!showRequests)}
              className="relative flex items-center bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100"
            >
              <FaBell size={20} />
              {friendRequests.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </button>
            {showRequests && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-lg z-50">
                {friendRequests.length === 0 ? (
                  <p className="p-3 text-gray-600">No friend requests</p>
                ) : (
                  friendRequests?.map((request) => (
                    <div
                      key={request.sender}
                      className="p-3 border-b flex justify-between items-center"
                    >
                      <p className="text-gray-700">{request.sender}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleFriendRequest(request.sender, true)
                          }
                          className="text-green-600 hover:text-green-800"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() =>
                            handleFriendRequest(request.sender, false)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="border border-orange-500 text-orange-500 px-5 py-2 rounded-lg font-semibold bg-white hover:bg-orange-50 shadow-md transition-all transform hover:scale-105"
          >
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-6 py-4">
          <ul className="flex flex-col gap-4 text-gray-600 text-lg font-medium">
            <li>
              <Link to="/homepage" className="hover:text-blue-500 transition">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => navigate("/chatpage")}
                className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Chatting
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="border border-orange-500 text-orange-500 px-5 py-2 rounded-lg font-semibold bg-white hover:bg-orange-50 shadow-md transition-all transform hover:scale-105"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      <ToastContainer />
    </nav>
  );
};
