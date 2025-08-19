import { ToastContainer, toast } from 'react-toastify';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../services/userSlice';
import { Navbar } from './chat/Navbar';
import { useUpdateProfileMutation } from '../services/userApi';

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const [editForm, setEditForm] = useState({
    username: user.username || '',
    profilePicture: null
  });
  const fileInputRef = useRef(null);

  // RTK query mutation hook
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Sync form when editing toggles
  React.useEffect(() => {
    if (isEditing) {
      setEditForm({
        username: user.username || '',
        profilePicture: editForm.profilePicture
      });
    }
  }, [user, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((prev) => ({
        ...prev,
        profilePicture: file, // store file object instead of base64
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
  const id = toast.loading("Updating profile...");
  try {
    const formData = new FormData();
    formData.append("username", editForm.username);
    if (editForm.profilePicture) {
      formData.append("profilePicture", editForm.profilePicture);
    }

    const updatedUser = await updateProfile(formData).unwrap();

    setProfilePicture(updatedUser.profilePicture);
    dispatch(setUser({
      ...user,
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture || user.profilePicture,
    }));

    setPreview(null);
    setIsEditing(false);

    toast.update(id, {
      render: "Profile updated successfully!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch (error) {
    toast.update(id, {
      render: error?.data?.message || "Error updating profile",
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  }
};

  if (!user.username) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No User Data</h2>
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">

            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-8 py-12">
              <div className="flex flex-col md:flex-row items-center gap-8">

                {/* Profile Picture */}
                <div className="relative">
                  <div
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => isEditing && fileInputRef.current.click()}
                  >
                    {isEditing && preview ? (
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    ) : user.profilePicture ? (
                      <img src={user.profilePicture || profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-600">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>

                  {/* hidden input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <p className="text-blue-100 mb-2">{user.email}</p>
                  <p className="text-blue-200 text-sm">Role: {user.role}</p>
                  <div className="flex items-center justify-center md:justify-start gap-6 mt-4 text-sm">
                    <span><strong>{user.friends?.length || 0}</strong> Friends</span>
                    <span><strong>{user.friendRequests?.length || 0}</strong> Requests</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            username: user.username || '',
                            profilePicture: null
                          });
                        }}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8 space-y-6">
              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <p className="text-gray-600 bg-gray-50 px-4 py-2 rounded-lg font-mono text-sm">{user.userID}</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.email}</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg capitalize">{user.role}</p>
              </div>

              {/* Friends Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Friends</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.friends?.length || 0}</p>
              </div>

              {/* Friend Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pending Friend Requests</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.friendRequests?.length || 0} pending requests</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
