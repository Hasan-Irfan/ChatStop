import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/userModel.js";

export const findUser = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, message: "Searched User found", user });
});

////////////////////////////////////////////////////////////////////////////////////////

export const sendRequest = asyncHandler(async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    // Find sender and receiver by username
    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });


    if (!senderUser || !receiverUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingFriend = receiverUser.friends.find(
      (friendUsername) => friendUsername === sender
    );

    if (existingFriend) {
      return res.status(400).json({ success: false, message: "Friend already exists" });
    }

    // Check if a friend request already exists
    const existingRequest = receiverUser.friendRequests.find(
      (req) => req.sender === sender
    );

    if (existingRequest) {
      return res.status(400).json({ success: false, message: "Friend request already sent" });
    }

    // Add the sender's username to the receiver's friendRequests array
    receiverUser.friendRequests.push({ sender: sender });

    // Save the updated receiver user
    await receiverUser.save();

    res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////

export const acceptOrDenyRequest = asyncHandler(async (req, res) => {
    try {
      const { state, senderUsername, receiverUsername } = req.body;
  
      const senderUser = await User.findOne({ username: senderUsername });
      const receiverUser = await User.findOne({ username: receiverUsername });
  
      if (!senderUser || !receiverUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const requestIndex = receiverUser.friendRequests.findIndex(
        (request) => request.sender === senderUsername
      );
  
      if (requestIndex === -1) {
        return res.status(400).json({ success: false, message: "Friend request not found" });
      }
  
      if (state === "accepted") {
        senderUser.friends.push(receiverUsername);
        receiverUser.friends.push(senderUsername);
      }

      receiverUser.friendRequests.splice(requestIndex, 1);

      await senderUser.save();
      await receiverUser.save();
  
      res.status(200).json({
        success: true,
        message: `Friend request ${state} successfully`,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
});

////////////////////////////////////////////////////////////////////////////////////////

export const getFriends = asyncHandler(async (req, res) => {
  const { username } = req.body; 

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "Friends list retrieved successfully",
    friends: user.friends,
  });
});

////////////////////////////////////////////////////////////////////////////////////////

export const getFriendRequest = asyncHandler(async (req, res) => {

  const username = req.user.username;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "Pending Friends list retrieved successfully",
    friendRequests: user.friendRequests,
  });
});