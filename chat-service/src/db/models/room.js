import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  deletedAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  rootRoom: {
    type: String
  },
  avatar: {
    type: String
  },
  users: [
    {
      type: String,
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  status: {
    type: String
  },
  whoCreated: {
    type: String
  },
  event: {
    type: String
  }
});

module.exports = mongoose.model("Room", roomSchema);
