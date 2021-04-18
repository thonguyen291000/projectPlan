import RootRoom from "../models/rootRoom";
import Room from "../models/room";

import { EXISTED_ONE, ROOT_ROOM_NOT_FOUND, ROOMS_MUST_EMPTY } from "../../const/errors";
import {DELETE_SUCCESS} from "../../const/commonString"

const db_getRootRooms = async (req, res, next) => {
  try {
    const results = await RootRoom.find();
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const db_getRootRoomByName = async (req, res, next) => {
  try {
    const result = await RootRoom.findOne({ name: req.params.name });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const db_createRootRoom = async (data, req, res, next) => {
  try {
    const newRootRoom = new RootRoom(data);

    // Check room is existed?
    const rootRooms = await RootRoom.find({ name: data.name });

    if (rootRooms.length !== 0) return next(new Error(EXISTED_ONE));

    // TODO: Check the request class is existed or not

    const result = await newRootRoom.save();

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_updateClassInRootRoom = async (req, res, next) => {
  try {
    const rootRoom = await RootRoom.findOne({ name: req.body.rootRoom });

    if (!rootRoom) return next(new Error(ROOT_ROOM_NOT_FOUND));

    rootRoom.class = req.body.class;

    await rootRoom.save();

    return res.status(201).json(rootRoom);
  } catch (error) {
    next(error);
  }
};

const db_updateRootRoom = async (req, res, next) => {
  try {
    const rootRoom = await RootRoom.findOne({ name: req.body.rootRoom });
    if (!rootRoom) return next(new Error(ROOT_ROOM_NOT_FOUND));

    const anotherRootRoom = await RootRoom.findOne({ name: req.body.name });
    if (anotherRootRoom) return next(new Error(EXISTED_ONE));

    // Update rooms of root room
    if (rootRoom.rooms.length > 0) {
      for await (const roomName of rootRoom.rooms) {
        const room = await Room.findOne({ name: roomName });

        room.rootRoom = req.body.name;
        await room.save();
      }
    }

    rootRoom.updatedAt = new Date();
    rootRoom.name = req.body.name;

    // Update
    await rootRoom.save();

    return res.status(201).json(rootRoom);
  } catch (error) {
    next(error);
  }
};

const db_deleteRootRoom = async (req, res, next) => {
  try {
    const rootRoom = await RootRoom.findOne({ name: req.body.name});

    if(!rootRoom) return next(new Error(ROOT_ROOM_NOT_FOUND))

    if(rootRoom.rooms.length > 0) return next(new Error(ROOMS_MUST_EMPTY));

    await rootRoom.remove();

    return res.status(201).json(DELETE_SUCCESS)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  db_getRootRooms,
  db_getRootRoomByName,
  db_createRootRoom,
  db_updateClassInRootRoom,
  db_updateRootRoom,
  db_deleteRootRoom
};
