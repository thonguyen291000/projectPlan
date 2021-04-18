import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  content: {
    type: toString,
  },
  seen: {
    type: Boolean,
    default: false,
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
  user: {
    type: String,
    required: true
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
