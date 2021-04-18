import { addHours } from "date-fns";

import User from "../models/user";
import UserSession from "../models/userSession";
import Class from "../models/class";

import passwordCompareSync from "../../helpers/passwordCompareSync";
import generateUUID from "../../helpers/generateUUID";
// String const
import {
  USER_EXISTED,
  INCORRECT_EMAIL,
  INCORRECT_PASSWORD,
  USER_NOT_FOUND,
  INCORRECT_SESSION_ID,
  SESSION_EXISTED,
  CLASS_NOT_FOUND,
  USER_IN_CLASS,
  MESSAGE_IN_USER,
  USER_NOT_IN_CLASS,
} from "../../const/errors";
import {
  DELETE_SUCCESS,
  CLASSES_ROOMS_MUST_EMPTY,
  SUCCESSFULLY,
} from "../../const/commonString";
import { USER_SESSION_EXPIRY_HOURS } from "../../const/sessionsExpire";
import { request } from "express";

const db_login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new Error(INCORRECT_EMAIL));

    user.status = "online";

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_logout = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new Error(INCORRECT_EMAIL));

    user.status = "offline";

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_createSession = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new Error(INCORRECT_EMAIL));

    if (!passwordCompareSync(req.body.password, user.password))
      return next(new Error(INCORRECT_PASSWORD));

    const session = await UserSession.findOne({ user: user._id });

    if (session) return next(new Error(SESSION_EXISTED));

    const expiredAt = addHours(new Date(), USER_SESSION_EXPIRY_HOURS);

    const sessionsToken = generateUUID();

    const userSessions = new UserSession({
      id: sessionsToken,
      user: user._id,
      expiredAt,
    });

    const result = await userSessions.save();

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_deleteSession = async (req, res, next) => {
  try {
    const sessions = await UserSession.find({ id: req.params.id });

    if (sessions.length === 0) return next(new Error(INCORRECT_SESSION_ID));

    await UserSession.deleteOne({ id: req.params.id });

    return res.end();
  } catch (error) {
    next(error);
  }
};

const db_getUserSession = async (req, res, next) => {
  try {
    const sessions = await UserSession.find({ id: req.params.id });
    if (sessions.length === 0) return next(new Error(INCORRECT_SESSION_ID));

    return res.status(200).json(sessions[0]);
  } catch (error) {
    next(error);
  }
};

const db_createUser = async (data, req, res, next) => {
  try {
    const userEmail = await User.findOne({ email: data.email });

    // Check user existed ?
    if (userEmail) return next(new Error(USER_EXISTED));

    const user = new User(data);
    const result = await user.save();
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_getUser = async (req, res, next) => {
  try {
    var user;
    if (req.params.email) {
      user = await User.findOne({ email: req.params.email });
    } else {
      user = await User.findOne({ id: req.params.id });
    }
    if (!user) return next(new Error(USER_NOT_FOUND));

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const db_getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new Error(USER_NOT_FOUND));

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const db_getAllUser = async (req, res, next) => {
  try {
    const results = await User.find();

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const db_updateUser = async (newPassword, req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new Error(USER_NOT_FOUND));

    //Update
    if (req.body.name !== "") {
      user.name = req.body.name;
    }

    if (req.body.password !== "") {
      user.password = newPassword;
    }

    if (req.body.avatar !== "") {
      user.avatar = req.body.avatar;
    }

    if (req.body.seenRooms) {
      user.seenRooms = req.body.seenRooms;
    }

    user.updatedAt = new Date();

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_updateUserToClass = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new Error(USER_NOT_FOUND));

    const receivedClass = await Class.findOne({ name: req.body.class });

    if (!receivedClass) return next(new Error(CLASS_NOT_FOUND));

    // Update user to class
    const checkUserInClass = receivedClass.users.find(
      (element) => element === user.email
    );
    if (!checkUserInClass) {
      receivedClass.users.push(user.email);
      await receivedClass.save();
    } else {
      return next(new Error(USER_IN_CLASS));
    }

    // Update class to user
    user.classes.push(receivedClass.name);
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_updateUserToClasses = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new Error(USER_NOT_FOUND));

    const classes = req.body.classes;

    for (var i = 0; i < classes.length; i++) {
      var receivedClass = await Class.findOne({ name: classes[i] });

      if (!receivedClass) return next(new Error(CLASS_NOT_FOUND));

      // Update user to class
      var checkUserInClass = receivedClass.users.find(
        (element) => element === user.email
      );
      if (!checkUserInClass) {
        receivedClass.users.push(user.email);
        await receivedClass.save();
      } else {
        return next(new Error(USER_IN_CLASS));
      }

      // Update class to user
      user.classes.push(receivedClass.name);
      await user.save();
    }

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_updateMessageToUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.user });

    const checkMessageInUser = user.messages.find(
      (element) => element === req.body.message
    );
    if (!checkMessageInUser) {
      user.messages.push(req.body.message);
      await user.save();
    } else {
      return next(new Error(MESSAGE_IN_USER));
    }

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_updateRoomToUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.user });

    if (!user) return next(new Error(USER_NOT_FOUND));

    // Update user's rooms
    user.rooms.push(req.body.room);
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_updateUsersToRoom = async (req, res, next) => {
  const returnedUsers = ["asd"];
  try {
    const users = await User.find({ email: { $in: req.body.users } });

    if (users.length === 0) return next(new Error(USER_NOT_FOUND));

    var incorrectUsers = [];
    for await (const user of users) {
      if (user.classes.indexOf(req.body.class) !== -1) {
        if (user.rooms.length > 0) {
          const positionRoom = user.rooms.indexOf(req.body.room);
          if (positionRoom === -1) user.rooms.push(req.body.room);
          else continue;
        } else {
          user.rooms = [req.body.room];
        }
        returnedUsers.push(user.email);
        user.save();
      } else {
        if (incorrectUsers.length === 0) {
          incorrectUsers = [USER_NOT_IN_CLASS(user.email, req.body.class)];
        } else {
          incorrectUsers.push(USER_NOT_IN_CLASS(user.email, req.body.class));
        }
      }
    }

    returnedUsers.shift();

    return res.status(201).json({
      users: returnedUsers,
      errors: incorrectUsers,
    });
  } catch (error) {
    next(error);
  }
};

const db_updateRoomInUsers = async (req, res, next) => {
  try {
    const users = await User.find({ email: { $in: req.body.users } });

    for await (const user of users) {
      const newRooms = user.rooms.filter(
        (item) => item !== req.body.room.oldName
      );

      newRooms.push(req.body.room.newName);

      user.rooms = newRooms;

      await user.save();
    }

    return res.status(201).json(SUCCESSFULLY);
  } catch (error) {
    next(error);
  }
};

const db_removeRoomFromUsers = async (req, res, next) => {
  try {
    const users = await User.find({ email: { $in: req.body.users } });

    for await (const user of users) {
      if (user.rooms.length > 1) {
        user.rooms = user.rooms.filter((item) => item != req.body.room);
      } else {
        user.rooms = [];
      }
      await user.save();
    }

    return res.status(201).json(SUCCESSFULLY);
  } catch (error) {
    next(error);
  }
};

const db_removeMessageFromUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.user });

    if (user.messages.length > 1) {
      user.messages = user.messages.filter((item) => item !== req.body.message);
    } else {
      user.messages = [];
    }
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_deleteRoomFromUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.user });

    //Delete room from user
    user.rooms = user.rooms.filter((room) => room !== req.body.room);

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const db_deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new Error(USER_NOT_FOUND));

    // Delete when related classes or rooms are empty
    if (user.classes.length === 0 && user.rooms.length === 0) {
      await user.remove();
      return res.status(201).json(DELETE_SUCCESS);
    }

    return res.status(201).json(CLASSES_ROOMS_MUST_EMPTY);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  db_login,
  db_logout,
  db_createUser,
  db_createSession,
  db_getUser,
  db_getUserById,
  db_getAllUser,
  db_getUserSession,
  db_deleteSession,
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
};
