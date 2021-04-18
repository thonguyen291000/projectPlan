import {
  db_createRootRoom,
  db_getRootRooms,
  db_getRootRoomByName,
  db_updateClassInRootRoom,
  db_updateRootRoom,
  db_deleteRootRoom
} from "../../db/functions/rootRoom";

import {
  CLASS_REQUIRED,
  NAME_REQUIRED,
  ROOT_ROOM_REQUIRED,
} from "../../const/errors";
import { createdAt, deletedAt, updatedAt } from "../../helpers/date";

const getRootRooms = async (req, res, next) => {
  await db_getRootRooms(req, res, next);
};

const getRootRoomByName = async (req, res, next) => {
  if (req.params.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  await db_getRootRoomByName(req, res, next);
};

const createRootRoom = async (req, res, next) => {
  if (req.body.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  if (req.body.presentClass === "") {
    return next(new Error(CLASS_REQUIRED));
  }

  const data = {
    name: req.body.name,
    createdAt,
    deletedAt,
    updatedAt,
    class: req.body.presentClass,
    rooms: [],
  };

  await db_createRootRoom(data, req, res, next);
};

const updateClassInRootRoom = async (req, res, next) => {
  if (req.body.class === "") {
    return next(new Error(CLASS_REQUIRED));
  }

  if (req.body.rootRoom === "") {
    return next(new Error(ROOT_ROOM_REQUIRED));
  }

  await db_updateClassInRootRoom(req, res, next);
};

const updateRootRoom = async (req, res, next) => {
  if (req.body.rootRoom === "") {
    return next(new Error(ROOT_ROOM_REQUIRED));
  }

  if (req.body.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  await db_updateRootRoom(req, res, next);
};

const deleteRootRoom = async (req, res, next) => {

  if(req.body.name === "") return next(new Error(NAME_REQUIRED));

  await db_deleteRootRoom(req, res, next);
};

module.exports = {
  getRootRooms,
  getRootRoomByName,
  createRootRoom,
  updateClassInRootRoom,
  updateRootRoom,
  deleteRootRoom,
};
