import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
