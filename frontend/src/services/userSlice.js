import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: localStorage.getItem("username") || null,
  role: localStorage.getItem("role") || null,
  userID: localStorage.getItem("userID") || null,
  friends: JSON.parse(localStorage.getItem("friends")) || [],  
  friendRequests: JSON.parse(localStorage.getItem("friendRequests")) || [],  
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.userID = action.payload.userID;
      state.friends = action.payload.friends;  
      state.friendRequests = action.payload.friendRequests;  
      
      // Save to localStorage
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("userID", action.payload.userID);
      localStorage.setItem("friends", JSON.stringify(action.payload.friends));
      localStorage.setItem("friendRequests", JSON.stringify(action.payload.friendRequests));
    },
    updateFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
      localStorage.setItem("friendRequests", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.username = null;
      state.role = null;
      state.userID = null;
      state.friends = [];  
      state.friendRequests = [];  

      // Clear localStorage
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userID");
      localStorage.removeItem("friends");
      localStorage.removeItem("friendRequests");
    },
  },
});

export const { setUser,updateFriendRequests, logout } = userSlice.actions;
export default userSlice.reducer;
