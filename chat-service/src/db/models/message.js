import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: {
    type: String,
  },
  seen: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
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
  filename: {
    type: String,
  },
  mimetype: {
    type: String,
  },
  encoding: {
    type: String,
  },
  url: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  usersSeenMessage: [
    {
      type: String,
    },
  ],
  replyToMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  reacts: [
    {
      type: String,
    }
  ]
});

module.exports = mongoose.model("Message", messageSchema);
