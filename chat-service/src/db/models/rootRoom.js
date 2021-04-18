import mongoose from "mongoose";

const Schema = mongoose.Schema;

const rootRoomSchema = new Schema({
  name: {
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
  class: {
    type: String
  },
  rooms: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("RootRoom", rootRoomSchema);
