import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, default: "visitor"},

    friends: [{ type: String }], 
    friendRequests: [
      {
        sender: { type: String }, 
        state: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
      },
      { _id: false } 
    ],

    refreshToken: { type: String },
  },
  { timestamps: true }
);


export const User = mongoose.model("User", userSchema);


