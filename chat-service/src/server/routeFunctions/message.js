import mongoose from "mongoose";

import {
  db_createMessage,
  db_getAllMessages,
  db_getMessgesForARoom,
  db_getMessageById,
  db_updateMessage,
  db_updateFileToMessage,
  db_deleteMessage,
} from "../../db/functions/message";

import {
  NO_CONTENT_MESSAGE,
  ROOM_NAME_REQUIRED,
  MESSAGE_REQUIRED,
  MESSAGE_ID_INCORRECT,
  CONTENT_SEEN_REQUIRED,
} from "../../const/errors";
import { createdAt, deletedAt, updatedAt } from "../../helpers/date";

const createMessage = async (req, res, next) => {
  if (req.body.content === "" && !req.body.filename) {
    return next(new Error(NO_CONTENT_MESSAGE));
  }

  if (req.body.room === "") {
    return next(new Error(ROOM_NAME_REQUIRED));
  }

  const data = {
    content: req.body.content,
    createdAt,
    deletedAt,
    updatedAt,
    room: req.body.room,
    user: req.body.user,
    seen: false,
    type: req.body.type ? req.body.type : "text",
    filename: req.body.filename,
    mimetype: req.body.mimetype,
    url: req.body.url,
    encoding: req.body.encoding,
    size: req.body.size,
    usersSeenMessage: [req.body.user],
    replyToMessage: req.body.replyToMessage ? req.body.replyToMessage : null,
  };

  await db_createMessage(data, req, res, next);
};

const getMessgesForARoom = async (req, res, next) => {
  if (req.params.room === "") {
    return next(new Error(ROOM_NAME_REQUIRED));
  }

  await db_getMessgesForARoom(req, res, next);
};

const getAllMessages = async (req, res, next) => {
  await db_getAllMessages(req, res, next);
};

const getMessageById = async (req, res, next) => {
  if (req.params.id === "") {
    return next(new Error(MESSAGE_REQUIRED));
  }

  // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //   return next(new Error(MESSAGE_ID_INCORRECT));
  // }

  await db_getMessageById(req, res, next);
};

const updateMessage = async (req, res, next) => {
  if (req.body.message === "") {
    return next(new Error(MESSAGE_REQUIRED));
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.message)) {
    return next(new Error(MESSAGE_ID_INCORRECT));
  }

  if (
    req.body.content === "" &&
    req.body.seen === "" &&
    req.body.type === "" &&
    req.body.usersSeenMessage
  ) {
    return next(new Error(CONTENT_SEEN_REQUIRED));
  }

  await db_updateMessage(req, res, next);
};

const updateFileToMessage = async (req, res, next) => {
  await db_updateFileToMessage(req, res, next);
};

const deleteMessage = async (req, res, next) => {
  if (req.body.message === "") {
    return next(new Error(MESSAGE_REQUIRED));
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.message)) {
    return next(new Error(MESSAGE_ID_INCORRECT));
  }

  await db_deleteMessage(req, res, next);
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessgesForARoom,
  getMessageById,
  updateMessage,
  updateFileToMessage,
  deleteMessage,
};
