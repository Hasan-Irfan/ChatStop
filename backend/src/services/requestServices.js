import { User } from "../model/userModel.js";

export const findUserService = async (username) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("User not found");
  return user;
};

export const sendRequestService = async (sender, receiver) => {
  const senderUser = await User.findOne({ username: sender });
  const receiverUser = await User.findOne({ username: receiver });

  if (!senderUser || !receiverUser) {
    throw new Error("User not found");
  }

  const existingFriend = receiverUser.friends.includes(sender);
  if (existingFriend) throw new Error("Friend already exists");

  const existingRequest = receiverUser.friendRequests.find(
    (req) => req.sender === sender
  );
  if (existingRequest) throw new Error("Friend request already sent");

  receiverUser.friendRequests.push({ sender });
  await receiverUser.save();

  return true;
};

export const acceptOrDenyRequestService = async (state, senderUsername, receiverUsername) => {
  const senderUser = await User.findOne({ username: senderUsername });
  const receiverUser = await User.findOne({ username: receiverUsername });

  if (!senderUser || !receiverUser) {
    throw new Error("User not found");
  }

  const requestIndex = receiverUser.friendRequests.findIndex(
    (req) => req.sender === senderUsername
  );
  if (requestIndex === -1) throw new Error("Friend request not found");

  if (state === "accepted") {
    senderUser.friends.push(receiverUsername);
    receiverUser.friends.push(senderUsername);
  }

  receiverUser.friendRequests.splice(requestIndex, 1);

  await senderUser.save();
  await receiverUser.save();

  return state;
};

export const getFriendsService = async (username) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("User not found");
  return user.friends;
};

export const getFriendRequestService = async (username) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("User not found");
  return user.friendRequests;
};
