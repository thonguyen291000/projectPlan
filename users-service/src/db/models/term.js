import mongoose from "mongoose";

const Schema = mongoose.Schema;

const termSchema = new Schema({
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
  classes: [
      {
          type: String,
      }
  ],
  subject: {
      type: String,
      required: true
  }
});

module.exports = mongoose.model("Term", termSchema);
