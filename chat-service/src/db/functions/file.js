import File from "../models/file";
import { } from "../../const/errors";

const db_createFile = async (data, req, res, next) => {
  try {
    if (!req.body.file) {
      const newMessage = new File(data);

      await newMessage.save();

      res.status(201).json(newMessage);
    } else {

    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
    db_createFile,
};
