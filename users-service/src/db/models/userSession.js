import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSessionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  user: {
      type: Schema.Types.ObjectId,
      required: true
  },
  expiredAt: {
      type: Date,
      required: true
  }
});

module.exports = mongoose.model("UserSession", userSessionSchema);
