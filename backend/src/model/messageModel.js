import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema(
  {
    participants: {
      type: [String], 
      required: true,
      validate: {
        validator: function (participants) {
          return participants.length === 2;
        },
        message: "A chat thread must have exactly two participants.",
      },
    },
    messages: [
      {
        sender: { type: String, required: true }, 
        message: { type: String, required: true }, 
        timestamp: { type: Date, default: Date.now }, 
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);