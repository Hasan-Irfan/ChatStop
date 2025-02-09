import { Message } from "../model/messageModel.js";
import { User } from "../model/userModel.js";
import {  getReceipientSocketId, io } from "../socket/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { sender, recipient, message } = req.body;
  const loggedInUser = req.user.username;
  try {
    if (loggedInUser !== sender) {
      return res
        .status(403)
        .json({ message: "You can only send messages as yourself" });
    }

    const senderUser = await User.findOne({ username: sender });
    if (!senderUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

    if (!senderUser.friends.includes(recipient)) {
      return res
        .status(403)
        .json({ message: "You can only send messages to friends" });
    }

    let chat = await Message.findOne({
      participants: { $all: [sender, recipient] },
    });

    if (!chat) {
      chat = new Message({
        participants: [sender, recipient],
        messages: [],
      });
    }

    const newMessage = { sender, message, timestamp: Date.now() }; 

    chat.messages.push(newMessage);

    await chat.save();

    const recipientSocketId = getReceipientSocketId(recipient);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ message: "Message sent successfully", data: chat });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////

export const getConversation = asyncHandler(async (req, res) => {
  const { friend } = req.params;
  const loggedInUser = req.user.username;

  try {
    const friendUser = await User.findOne({ username: friend });
    if (!friendUser) {
      return res.status(404).json({ message: "Friend not found" });
    }

    const loggedInUserData = await User.findOne({ username: loggedInUser });
    if (!loggedInUserData.friends.includes(friend)) {
      return res
        .status(403)
        .json({ message: "You can only view messages with friends" });
    }

    const chat = await Message.findOne({
      participants: { $all: [loggedInUser, friend] },
    });

    if (!chat) {
      return res.status(404).json({ message: "No chat thread found" });
    }

    res.status(200).json({
      message: "Messages retrieved successfully",
      data: chat.messages,
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
