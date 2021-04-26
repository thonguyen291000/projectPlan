import mongoose from "mongoose";

import Message from "../models/message";
import Room from "../models/room";
import File from "../models/file";

import {
  INVALID_ROOM,
  MESSAGE_NOT_FOUND,
  ROOM_NOT_FOUND,
} from "../../const/errors";
import { SUCCESSFULLY } from "../../const/commonString";

const db_createMessage = async (data, req, res, next) => {
  try {
    // Find room
    const room = await Room.findOne({ name: data.room });

    if (!room) return next(new Error(INVALID_ROOM));

    const newMessage = new Message(data);

    await newMessage.save();

    return res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

const db_getMessgesForARoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ name: req.params.room });

    if (!room) return next(new Error(ROOM_NOT_FOUND));

    const messages = await Message.find({ room: req.params.room }).sort({
      _id: "desc",
    });

    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

const db_getAllMessages = async (req, res, next) => {
  try {
    const results = await Message.find();

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const db_getMessagesByIdOneTime = async (req, res, next) => {

  var messageIds = req.params.messageIds.split(",")
  var newIds = [];
  
  for (let index = 0; index < messageIds.length; index++) {
    const element = messageIds[index];

    newIds.push(mongoose.Types.ObjectId(element));
  }
  
  try {
    const result = await Message.find({ _id: { $in: newIds } });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const db_getMessageById = async (req, res, next) => {
  try {
    const result = await Message.findById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    // next(error);
    return res.status(200).json(null);
  }
};

const db_updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.body.message);

    if (!message) return next(new Error(MESSAGE_NOT_FOUND));

    if (
      req.body.fileName !== "" &&
      req.body.mimetype !== "" &&
      req.body.encoding !== "" &&
      req.body.url !== ""
    ) {
      message.fileName = req.body.fileName;
      message.mimetype = req.body.mimetype;
      message.encoding = req.body.encoding;
      message.url = req.body.url;
    }

    if (req.body.content !== "") {
      message.content = req.body.content;
    }

    if (req.body.seen !== "") {
      if (req.body.seen === "true") {
        message.seen = true;
      } else {
        message.seen = false;
      }
    }

    if (req.body.type !== "") {
      message.type = req.body.type;
    }

    if (req.body.usersSeenMessage) {
      message.usersSeenMessage = req.body.usersSeenMessage;
    }

    if (req.body.reacts) {
      message.reacts = req.body.reacts;
    }

    message.updatedAt = new Date();
    // Update
    await message.save();

    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const db_updateFileToMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.body.message);

    if (!message) return next(new Error(MESSAGE_NOT_FOUND));

    message.file = {
      fileName: req.body.file.filename,
      mimetype: req.body.file.mimetype,
      encoding: req.body.file.encoding,
      url: req.body.file.url,
    };
  } catch (error) {}
};

const db_deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.body.message);

    if (!message) return next(new Error(MESSAGE_NOT_FOUND));

    // Remove related file
    if (message.file) {
      await File.findByIdAndDelete(message.file);
    }

    const room = await Room.findOne({ name: message.room });
    if (room.messages.length > 2) {
      room.messages = room.messages.filter((message) => {
        return message != req.body.message;
      });
    } else {
      room.messages = [];
    }

    await room.save();

    await message.remove();

    return res.status(201).json(SUCCESSFULLY);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  db_createMessage,
  db_getAllMessages,
  db_getMessgesForARoom,
  db_getMessageById,
  db_updateMessage,
  db_updateFileToMessage,
  db_deleteMessage,
  db_getMessagesByIdOneTime,
};
