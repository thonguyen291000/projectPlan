import mongoose from "mongoose";

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
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
  message: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("File", fileSchema);
