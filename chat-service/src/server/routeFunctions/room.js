import {
  db_createRoom,
  db_getRooms,
  db_getRoomByName,
  db_getRoomsByName,
  db_updateRoom,
  db_updateMessageToRoom,
  db_addUsersToRoom,
  db_removeUsersFromRoom,
  db_deleteRoom,
} from "../../db/functions/room";

import {
  USER_REQUIRED,
  NAME_REQUIRED,
  ROOT_ROOM_REQUIRED,
  NAME_DESCRIPTION_REQUIRED,
  ROOM_REQUIRED,
  MESSAGE_REQUIRED,
} from "../../const/errors";
import { createdAt, deletedAt, updatedAt } from "../../helpers/date";

const getRooms = async (req, res, next) => {
  await db_getRooms(req, res, next);
};

const getRoomByName = async (req, res, next) => {
  if (req.params.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  await db_getRoomByName(req, res, next);
};

const getRoomsByName = async (req, res, next) => {
  await db_getRoomsByName(req, res, next);
};

const createRoom = async (req, res, next) => {
  if (req.body.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  if (req.body.users.length === 0) {
    return next(new Error(USER_REQUIRED));
  }

  if (req.body.rootRoom === "") {
    return next(new Error(ROOT_ROOM_REQUIRED));
  }

  const data = {
    name: req.body.name,
    description: req.body.description,
    createdAt,
    deletedAt,
    updatedAt,
    status: "online",
    users: req.body.users,
    rootRoom: req.body.rootRoom,
    avatar: req.body.avatar,
    whoCreated: req.body.whoCreated,
  };

  await db_createRoom(data, req, res, next);
};

const updateRoom = async (req, res, next) => {
  if (req.body.room === "") return next(new Error(ROOM_REQUIRED));

  if (
    req.body.name === "" &&
    req.body.description === "" &&
    req.body.status === "" &&
    req.body.avatar === "" &&
    !req.body.event
  ) {
    return next(new Error(NAME_DESCRIPTION_REQUIRED));
  }

  await db_updateRoom(req, res, next);
};

const updateMessageToRoom = async (req, res, next) => {
  if (req.body.message === "") return next(new Error(MESSAGE_REQUIRED));
  if (req.body.room === "") return next(new Error(ROOM_REQUIRED));

  await db_updateMessageToRoom(req, res, next);
};

const addUsersToRoom = async (req, res, next) => {
  if (req.body.users.length === 0) {
    return next(new Error(USER_REQUIRED));
  }

  if (req.body.room === "") return next(new Error(ROOM_REQUIRED));

  await db_addUsersToRoom(req, res, next);
};

const removeUsersFromRoom = async (req, res, next) => {
  if (req.body.users.length === 0) {
    return next(new Error(USER_REQUIRED));
  }

  if (req.body.room === "") return next(new Error(ROOM_REQUIRED));

  await db_removeUsersFromRoom(req, res, next);
};

const deleteRoom = async (req, res, next) => {
  if (req.body.room === "") return next(new Error(ROOM_REQUIRED));

  await db_deleteRoom(req, res, next);
};

module.exports = {
  getRooms,
  getRoomByName,
  getRoomsByName,
  createRoom,
  updateRoom,
  updateMessageToRoom,
  addUsersToRoom,
  removeUsersFromRoom,
  deleteRoom,
};
