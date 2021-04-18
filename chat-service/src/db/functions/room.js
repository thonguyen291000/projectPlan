import Room from "../models/room";
import RootRoom from "../models/rootRoom";
import Message from "../models/message";
import {
  EXISTED_ONE,
  CREATE_ROOM_WITHOUT_ROOT_ROOM,
  ROOM_NOT_FOUND,
  USERS_MUST_EMPTY,
  USER_INAPPROPRIATE_DELETE,
  ROOM_NAME_EXISTED,
} from "../../const/errors";
import { DELETE_SUCCESS } from "../../const/commonString";

const db_getRooms = async (req, res, next) => {
  try {
    const results = await Room.find();

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const db_getRoomByName = async (req, res, next) => {
  try {
    var room;
    if (req.params.rootRoom !== "@") {
      room = await Room.findOne({
        name: req.params.name,
        rootRoom: req.params.rootRoom,
      });
    } else {
      room = await Room.findOne({ name: req.params.name });
    }

    //Chinh sau
    // if (!room) return next(new Error(ROOM_NOT_FOUND));

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

const db_getRoomsByName = async (req, res, next) => {
  console.log(req.params.names.split(","));
  try {
    var rooms = await Room.find({
      name: { $in: req.params.names.split(",") },
    });

    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

const db_createRoom = async (data, req, res, next) => {
  try {
    const rootRoom = await RootRoom.findOne({ name: data.rootRoom });

    if (!rootRoom) {
      return next(new Error(CREATE_ROOM_WITHOUT_ROOT_ROOM));
    }

    // Check room is existed?
    const rooms = await Room.find({ name: data.name });
    if (rooms.length !== 0) return next(new Error(EXISTED_ONE));

    // TODO: Check the request class is existed or not

    const newRoom = new Room({
      ...data,
    });

    const result = await newRoom.save();

    // Update created room in root room
    if (rootRoom.rooms.indexOf(result.name) === -1) {
      if (rootRoom.rooms.length === 0) {
        rootRoom.rooms = [result.name];
      } else {
        rootRoom.rooms.push(result.name);
      }
      await rootRoom.save();
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ name: req.body.room });

    var roomWithNewName = null;

    if (req.body.name !== "") {
      roomWithNewName = await Room.findOne({ name: req.body.name });
    }

    if (room.length === 0) return next(new Error(ROOM_NOT_FOUND));

    if (roomWithNewName) return next(new Error(ROOM_NAME_EXISTED));

    if (req.body.avatar !== "") {
      room.avatar = req.body.avatar;
    }

    if (req.body.description !== "") {
      room.description = req.body.description;
    }
    console.log(req.body.event)
    if (req.body.event) {
      room.event = req.body.event;
    }

    if (req.body.name !== "") {
      // Update room in root room
      const rootRoom = await RootRoom.findOne({ name: room.rootRoom });

      for (var i = 0; i < rootRoom.rooms.length; i++) {
        if (rootRoom.rooms[i].name === room.name) {
          rootRoom.rooms[i].name = req.body.name;

          break;
        }
      }
      await rootRoom.save();

      // Update room in Message
      for await (const messageId of room.messages) {
        try {
          const message = await Message.findById(messageId);

          message.room = req.body.name;
          await message.save();
        } catch (error) {}
      }
    }

    room.updatedAt = new Date();

    if (req.body.name === "") {
      room.name = req.body.room;
    } else {
      room.name = req.body.name;
    }

    await room.save();

    return res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

const db_updateMessageToRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ name: req.body.room });

    if (!room) return next(new Error(ROOM_NOT_FOUND));

    if (room.messages.length > 0) {
      room.messages.push(req.body.message);
    } else {
      room.messages = [req.body.message];
    }

    await room.save();

    return res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

const db_addUsersToRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ name: req.body.room });

    if (!room) return next(new Error(ROOM_NOT_FOUND));

    var users = req.body.users;

    for (var i = 0; i < users.length; i++) {
      room.users.push(users[i]);
    }

    await room.save();

    return res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

const db_removeUsersFromRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ name: req.body.room });

    if (!room) return next(new Error(ROOM_NOT_FOUND));

    var users = req.body.users;
    if (room.users.length > 0) {
      for (var i = 0; i < users.length; i++) {
        room.users = room.users.filter((item) => item !== users[i]);
      }
    }

    await room.save();

    return res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

const db_deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ name: req.body.name });

    if (!room) return next(new Error(ROOM_NOT_FOUND));

    if (req.body.whoDeleted !== room.whoCreated)
      return next(new Error(USER_INAPPROPRIATE_DELETE));

    if (room.users.length > 1) return next(new Error(USERS_MUST_EMPTY));

    // if (room.messages.length > 0) return next(new Error(MESSAGES_MUST_EMPTY));

    const rootRoom = await RootRoom.findOne({ name: room.rootRoom });
    const positionRoom = rootRoom.rooms.indexOf(room.name);
    rootRoom.rooms.splice(positionRoom, 1);
    await rootRoom.save();

    // Delete
    await room.remove();

    return res.status(201).json(DELETE_SUCCESS);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  db_getRooms,
  db_getRoomByName,
  db_getRoomsByName,
  db_createRoom,
  db_updateRoom,
  db_updateMessageToRoom,
  db_addUsersToRoom,
  db_removeUsersFromRoom,
  db_deleteRoom,
};
