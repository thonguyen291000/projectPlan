import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
      type: String,
      required: true
  },
  description: {
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
    required: true
  },
  terms: [
      {
          type: String
      }
  ]
});

module.exports = mongoose.model("Subject", subjectSchema);
