import { Message } from "../model/messageModel.js";
import { User } from "../model/userModel.js";
import { getReceipientSocketId, io } from "../socket/socket.js";

export const sendMessageService = async (sender, recipient, message) => {
  const senderUser = await User.findOne({ username: sender });
  if (!senderUser) throw new Error("Sender not found");

  if (!senderUser.friends.includes(recipient)) {
    throw new Error("You can only send messages to friends");
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

  return chat;
};

export const getConversationService = async (loggedInUser, friend) => {
  const friendUser = await User.findOne({ username: friend });
  if (!friendUser) throw new Error("Friend not found");

  const loggedInUserData = await User.findOne({ username: loggedInUser });
  if (!loggedInUserData.friends.includes(friend)) {
    throw new Error("You can only view messages with friends");
  }

  const chat = await Message.findOne({
    participants: { $all: [loggedInUser, friend] },
  });

  if (!chat) throw new Error("No chat thread found");

  return chat.messages;
};
