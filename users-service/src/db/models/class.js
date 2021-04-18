import mongoose from "mongoose";

const Schema = mongoose.Schema;

const classSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  rootRoom: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  deletedAt: {
    type: Date,
    required: true,
  },
  users: [
    {
      type: String,
    },
  ],
  term: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Class", classSchema);
