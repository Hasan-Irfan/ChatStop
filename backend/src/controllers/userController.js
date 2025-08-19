// controllers/userController.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateUserProfile } from "../services/userServices.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from jwtVerify middleware
    const updatedUser = await updateUserProfile(userId, req.body, req.file);

    res.status(200).json({
      message: "Profile updated successfully",
      ...updatedUser.toObject(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
