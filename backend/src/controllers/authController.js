import { asyncHandler } from "../utils/asyncHandler.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const generateAccessandRefreshToken = (userID) => {
  try {
    const accessToken = jwt.sign(
      { _id: userID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "45m" }
    );

    const refreshToken = jwt.sign(
      { _id: userID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong during token generation"
    );
  }
};

///////////////////////////////////////////////////////////////////////////////////////

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res.status(404).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { accessToken, refreshToken } = generateAccessandRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;

    const loggedInUser = await user.save();

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        message: "Logged in successfully",
        username: loggedInUser.username,
        userID: loggedInUser._id,
        role: loggedInUser.role,
        friends: loggedInUser.friends,
        friendRequests: loggedInUser.friendRequests,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

///////////////////////////////////////////////////////////////////////////////////////

export const Signup = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all the fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a password of at least 6 characters",
      });
    }
    // Check if the email already exists
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "User or Email already exists" });
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

if (newUser.email === process.env.ADMIN_EMAIL) {
      newUser.role = "admin";
    } else {
      newUser.role = "user";
    }

    await newUser.save();

    return res.status(201).json({
      user: newUser.username,
      role: newUser.role,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////

export const logout = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken } = generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", incomingRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: incomingRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

////////////////////////////////////////////////////////////////////////////////////////

export const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }); // Corrected find method

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist",
      });
    }

    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailDetails = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      text: `http://localhost:3000/updatePassword/${resetToken}`,
    };

    mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        // console.error("Error Occurred:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to send email. Please try again later.",
        });
      } else {
        // console.log("Email sent successfully");
        return res.status(200).json({
          success: true,
          message: "Password reset link has been sent to your email.",
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

////////////////////////////////////////////////////////////////////////////////////////

export const updatePassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (!resetToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please enter a password",
    });
  }

  try {
    const decodedToken = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Link has expired. Please try again",
      });
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
});

////////////////////////////////////////////////////////////////////////////////////////

export const products = asyncHandler(async (req, res) => {
  // fetch products from database
  const products = "MOBILES";

 
  return res
  .status(200)
  .json({
    success: true,
    message: "success",
  });
});
