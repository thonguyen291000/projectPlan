import {
  db_createClass,
  db_getClasses,
  db_getClassByName,
  db_updateRootRoomToClass,
  db_updateClass,
  db_removeRootRoomFromClass,
  db_removeUsersFromClass,
  db_deleteClass,
} from "../../db/functions/class";
// String const
import {
  NAME_REQUIRED,
  TERM_REQUIRED,
  ROOT_ROOM_REQUIRE,
  CLASS_REQUIRED,
  NAME_DESCRIPTION_REQUIRED,
  USER_REQUIRED,
} from "../../const/errors";
import {} from "../../const/commonString";
// Helpers
import { createdAt, updatedAt, deletedAt } from "../../helpers/date";

const createClass = async (req, res, next) => {
  if (req.body.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  if (req.body.term === "") {
    return next(new Error(TERM_REQUIRED));
  }

  const data = {
    name: req.body.name,
    description: req.body.description,
    createdAt,
    updatedAt,
    deletedAt,
    rootRoom: "",
    users: [],
    term: req.body.term,
  };

  await db_createClass(data, req, res, next);
};

const getClasses = async (req, res, next) => {
  await db_getClasses(req, res, next);
};

const getClassByName = async (req, res, next) => {
  await db_getClassByName(req, res, next);
};

const updateRootRoomToClass = async (req, res, next) => {
  if (req.body.rootRoom === "") {
    return next(new Error(ROOT_ROOM_REQUIRE));
  }

  if (req.body.class === "") {
    return next(new Error(CLASS_REQUIRED));
  }

  await db_updateRootRoomToClass(req, res, next);
};

const updateClass = async (req, res, next) => {
  if (req.body.name === "" && req.body.description === "") {
    return next(new Error(NAME_DESCRIPTION_REQUIRED));
  }

  await db_updateClass(req, res, next);
};

const removeRootRoomFromClass = async (req, res, next) => {
  if (req.body.class === "") return next(new Error(CLASS_REQUIRED));

  await db_removeRootRoomFromClass(req, res, next);
};

const removeUsersFromClass = async (req, res, next) => {
  if (req.body.class === "") return next(new Error(CLASS_REQUIRED));

  if (req.body.users.length === 0) return next(new Error(USER_REQUIRED));

  await db_removeUsersFromClass(req, res, next);
};

const deleteClass = async (req, res, next) => {
  if (req.body.name === "") {
    return next(new Error(CLASS_REQUIRED));
  }

  await db_deleteClass(req, res, next);
};

module.exports = {
  createClass,
  getClasses,
  getClassByName,
  updateRootRoomToClass,
  updateClass,
  removeRootRoomFromClass,
  removeUsersFromClass,
  deleteClass,
};
