import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
  },
  avatar: {
    type: String,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  classes: [
    {
      type: String,
    },
  ],
  rooms: [
    {
      type: String,
    },
  ],
  seenRooms: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
