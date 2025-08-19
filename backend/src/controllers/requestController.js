import { asyncHandler } from "../utils/asyncHandler.js";
import {
  findUserService,
  sendRequestService,
  acceptOrDenyRequestService,
  getFriendsService,
  getFriendRequestService,
} from "../services/requestServices.js";

export const findUser = asyncHandler(async (req, res) => {
  try {
    const user = await findUserService(req.body.username);
    res.status(200).json({ success: true, message: "Searched User found", user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

export const sendRequest = asyncHandler(async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    await sendRequestService(sender, receiver);
    res.status(200).json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const acceptOrDenyRequest = asyncHandler(async (req, res) => {
  try {
    const { state, senderUsername, receiverUsername } = req.body;
    const result = await acceptOrDenyRequestService(state, senderUsername, receiverUsername);
    res.status(200).json({ success: true, message: `Friend request ${result} successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const getFriends = asyncHandler(async (req, res) => {
  try {
    const friends = await getFriendsService(req.body.username);
    res.status(200).json({
      success: true,
      message: "Friends list retrieved successfully",
      friends,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

export const getFriendRequest = asyncHandler(async (req, res) => {
  try {
    const friendRequests = await getFriendRequestService(req.user.username);
    res.status(200).json({
      success: true,
      message: "Pending Friends list retrieved successfully",
      friendRequests,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});
