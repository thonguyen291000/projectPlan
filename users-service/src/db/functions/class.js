import Class from "../models/class";
import Term from "../models/term";
import User from "../models/user";

// String const
import {
  CLASS_EXISTED,
  CLASS_NOT_FOUND,
  INCORRECT_TERM,
  ROOT_ROOM_USER_MUST_EMPTY,
  USER_NOT_FOUND,
} from "../../const/errors";

import { DELETE_SUCCESS } from "../../const/commonString";

const db_createClass = async (data, req, res, next) => {
  try {
    const classes = await Class.find({ name: data.name });

    // Check user existed ?
    if (classes.length !== 0) return next(new Error(CLASS_EXISTED));

    // Find related term
    const relatedTerm = await Term.findOne({ name: data.term });

    if (!relatedTerm) return next(new Error(INCORRECT_TERM));

    const newClass = new Class(data);
    const result = await newClass.save();

    // Update term
    relatedTerm.classes.push(result.name);
    await relatedTerm.save();

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_getClasses = async (req, res, next) => {
  try {
    const results = await Class.find();

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const db_getClassByName = async (req, res, next) => {
  try {
    const getClass = await Class.findOne({ name: req.params.name });

    if (!getClass) return next(new Error(CLASS_NOT_FOUND));

    return res.status(200).json(getClass);
  } catch (error) {
    next(error);
  }
};

const db_updateRootRoomToClass = async (req, res, next) => {
  try {
    const classObject = await Class.findOne({ name: req.body.class });

    if (!classObject) return next(new Error(CLASS_NOT_FOUND));

    // Update root room to class
    classObject.rootRoom = req.body.rootRoom;
    await classObject.save();

    return res.status(201).json(classObject);
  } catch (error) {
    next(error);
  }
};

const db_updateClass = async (req, res, next) => {
  try {
    const classObject = await Class.findOne({ name: req.body.class });

    if (!classObject) return next(new Error(CLASS_NOT_FOUND));

    // Update
    if (req.body.description !== "") {
      classObject.description = req.body.description;
    }

    if (req.body.name !== classObject.name) {
      const anotherClass = await Class.findOne({ name: req.body.name });

      if (anotherClass) return next(new Error(CLASS_EXISTED));

      // Check term and update class name in term
      if (classObject.term !== "") {
        const term = await Term.findOne({ name: classObject.term });

        if (term.classes.length > 1) {
          let positionClass = term.classes.indexOf(classObject.name);
          term.classes.slice(positionClass, 1);
          term.classes.push(req.body.name);
        } else {
          term.classes = [req.body.name];
        }

        await term.save();
      }

      // Check class in user
      if (classObject.users.length !== 0) {
        for (var i = 0; i < classObject.users.length; i++) {
          const user = await User.findOne({ email: classObject.users[i] });

          if (user.classes.length > 1) {
            let positionClass = user.classes.indexOf(classObject.name);
            user.classes.slice(positionClass, 1);
            user.classes.push(req.body.name);
          } else {
            user.classes = [req.body.name];
          }

          await user.save();
        }
      }

      // Update class name
      classObject.name = req.body.name;
    }

    classObject.updatedAt = new Date();

    await classObject.save();

    return res.status(201).json(classObject);
  } catch (error) {
    next(error);
  }
};

const db_removeRootRoomFromClass = async (req, res, next) => {
  try {
    const classObject = await Class.findOne({ name: req.body.class });

    if (!classObject) return next(new Error(CLASS_NOT_FOUND));

    classObject.rootRoom = "";
    await classObject.save();

    return res.status(201).json(classObject);
  } catch (error) {}
};

const db_removeUsersFromClass = async (req, res, next) => {
  try {
    const classObject = await Class.findOne({ name: req.body.class });
    const userObjects = await User.find({ email: { $in: req.body.users } });

    if (!classObject) return next(new Error(CLASS_NOT_FOUND));
    if (userObjects.length === 0) return next(new Error(USER_NOT_FOUND));

    // Remove class from user
    for (var i = 0; i < userObjects.length; i++) {
      userObjects[i].classes = userObjects[i].classes.filter(
        (item) => item !== req.body.class
      );
      await userObjects[i].save();
    }

    if (classObject.users.length > 0) {
      var users = req.body.users;
      for (var i = 0; i < users.length; i++) {
        classObject.users = classObject.users.filter(
          (item) => item !== users[i]
        );
      }
    }

    await classObject.save();

    return res.status(201).json(classObject);
  } catch (error) {
    next(error);
  }
};

const db_deleteClass = async (req, res, next) => {
  try {
    const classObject = await Class.findOne({ name: req.body.name });

    const term = await Term.findOne({ name: classObject.term });

    if (!classObject) return next(new Error(CLASS_NOT_FOUND));

    // Check rootRoom or users are empty ?
    if (classObject.rootRoom !== "" || classObject.users.length !== 0) {
      return next(new Error(ROOT_ROOM_USER_MUST_EMPTY));
    }

    // Delete
    await classObject.remove();

    // Remove class in term
    if (term.classes.length > 1) {
      term.classes = term.classes.filter((item) => item !== classObject.name);
    } else {
      term.classes = [];
    }

    await term.save();

    return res.status(201).json(DELETE_SUCCESS);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  db_createClass,
  db_getClasses,
  db_getClassByName,
  db_updateRootRoomToClass,
  db_updateClass,
  db_removeRootRoomFromClass,
  db_removeUsersFromClass,
  db_deleteClass,
};
