import cloudinary from "../config/cloudinary.js";
import { User } from "../model/userModel.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile_pictures" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export const updateUserProfile = async (userId, data, file) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // ✅ Handle profile picture
  if (file) {
    const result = await uploadToCloudinary(file.buffer);
    user.profilePicture = result.secure_url;
  }

  // ✅ Handle other fields
  if (data.username) user.username = data.username;
  if (data.email) user.email = data.email;

  await user.save();

  return user; // return updated user object
};
