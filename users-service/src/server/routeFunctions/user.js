import mongoose from "mongoose";

import {
  db_login,
  db_logout,
  db_createUser,
  db_createSession,
  db_getUser,
  db_getUserById,
  db_getAllUser,
  db_deleteSession,
  db_getUserSession,
  db_updateUser,
  db_updateUserToClass,
  db_updateUserToClasses,
  db_updateMessageToUser,
  db_updateRoomToUser,
  db_updateUsersToRoom,
  db_updateRoomInUsers,
  db_removeRoomFromUsers,
  db_removeMessageFromUser,
  db_deleteRoomFromUser,
  db_deleteUser,
} from "../../db/functions/user";
// String const
import {
  EMAIL_REQUIRED,
  NAME_REQUIRED,
  PASSWORD_REQUIRED,
  ROLE_REQUIRED,
  ID_USER_REQUIRED,
  CLASS_REQUIRED,
  MESSAGE_REQUIRED,
  USER_REQUIRED,
  ROOM_REQUIRED,
  UPDATE_DATA_USER_REQUIRED,
  INCORRECT_USER_ID,
} from "../../const/errors";
import {} from "../../const/commonString";
// Helpers
import { createdAt, updatedAt } from "../../helpers/date";
import hashPassword from "../../helpers/hashPassword";
import generateUUID from "../../helpers/generateUUID";

const login = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  await db_login(req, res, next);
};

const logout = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  await db_logout(req, res, next);
};

const createSession = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  if (req.body.password === "") {
    return next(new Error(PASSWORD_REQUIRED));
  }

  await db_createSession(req, res, next);
};

const deleteSession = async (req, res, next) => {
  await db_deleteSession(req, res, next);
};

const getUserSession = async (req, res, next) => {
  await db_getUserSession(req, res, next);
};

const createUser = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  if (req.body.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  if (req.body.password === "") {
    return next(new Error(PASSWORD_REQUIRED));
  }

  if (req.body.role === "") {
    return next(new Error(ROLE_REQUIRED));
  }

  const data = {
    id: generateUUID(),
    name: req.body.name,
    email: req.body.email,
    password: hashPassword(req.body.password),
    role: req.body.role,
    createdAt,
    updatedAt,
    status: "offline",
    avatar:
      "https://testuploadfiletho.s3-ap-southeast-1.amazonaws.com/user_avatar.jpg", //Fixed to test
    classes: [],
    rooms: [],
    messages: [],
    seenRooms: [],
  };

  await db_createUser(data, req, res, next);
};

const getUser = async (req, res, next) => {
  if (req.params.email) {
    if (req.params.email === "") {
      return next(new Error(EMAIL_REQUIRED));
    }
  } else {
    if (req.params.id === "") {
      return next(new Error(ID_USER_REQUIRED));
    }
  }

  await db_getUser(req, res, next);
};

const getUserById = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error(INCORRECT_USER_ID));
  }

  await db_getUserById(req, res, next);
};

const getAllUser = async (req, res, next) => {
  await db_getAllUser(req, res, next);
};

const updateUser = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  // Update password or user name
  if (
    req.body.name === "" &&
    req.body.password === "" &&
    req.body.avatar === "" &&
    !req.body.seenRooms
  ) {
    return next(new Error(UPDATE_DATA_USER_REQUIRED));
  }

  var newPassword;
  if (req.body.password !== "") {
    newPassword = hashPassword(req.body.password);
  }

  await db_updateUser(newPassword, req, res, next);
};

const updateUserToClass = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  if (req.body.class === "") {
    return next(new Error(CLASS_REQUIRED));
  }

  await db_updateUserToClass(req, res, next);
};

const updateUserToClasses = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  if (req.body.classes === "") {
    return next(new Error(CLASS_REQUIRED));
  }

  await db_updateUserToClasses(req, res, next);
};

const updateMessageToUser = async (req, res, next) => {
  if (req.body.message === "") {
    return next(new Error(MESSAGE_REQUIRED));
  }

  if (req.body.user === "") {
    return next(new Error(USER_REQUIRED));
  }

  await db_updateMessageToUser(req, res, next);
};

const updateRoomToUser = async (req, res, next) => {
  if (req.body.user === "") {
    return next(new Error(USER_REQUIRED));
  }

  if (req.body.room === "") {
    return next(new Error(ROOM_REQUIRED));
  }

  await db_updateRoomToUser(req, res, next);
};

const updateUsersToRoom = async (req, res, next) => {
  if (req.body.users.length === 0) {
    return next(new Error(USER_REQUIRED));
  }

  if (req.body.room === "") {
    return next(new Error(ROOM_REQUIRED));
  }

  await db_updateUsersToRoom(req, res, next);
};

const updateRoomInUsers = async (req, res, next) => {
  if (req.body.users.length === 0) {
    return next(new Error(USER_REQUIRED));
  }

  if (req.body.room === "") return next(new Error(ROOM_REQUIRED));
  await db_updateRoomInUsers(req, res, next);
};

const removeRoomFromUsers = async (req, res, next) => {
  await db_removeRoomFromUsers(req, res, next);
};

const removeMessageFromUser = async (req, res, next) => {
  await db_removeMessageFromUser(req, res, next);
};

const deleteRoomFromUser = async (req, res, next) => {
  if (req.body.room === "") {
    return next(new Error(ROLE_REQUIRED));
  }

  if (req.body.user === "") {
    return next(new Error(USER_REQUIRED));
  }

  await db_deleteRoomFromUser(req, res, next);
};

const deleteUser = async (req, res, next) => {
  if (req.body.email === "") {
    return next(new Error(EMAIL_REQUIRED));
  }

  await db_deleteUser(req, res, next);
};

module.exports = {
  login,
  logout,
  createUser,
  createSession,
  getUser,
  getUserById,
  getAllUser,
  getUserSession,
  deleteSession,
  updateUser,
  updateUserToClass,
  updateUserToClasses,
  updateMessageToUser,
  updateRoomToUser,
  updateUsersToRoom,
  updateRoomInUsers,
  removeRoomFromUsers,
  removeMessageFromUser,
  deleteRoomFromUser,
  deleteUser,
};
