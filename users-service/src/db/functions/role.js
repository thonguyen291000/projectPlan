import Role from "../models/role";

// String const
import { ROLE_EXISTED } from "../../const/errors";

const db_createRole = async (data, req, res, next) => {
  try {
    const role = await Role.findOne({ role: data.role });

    // Check user existed ?
    if (role) return next(new Error(ROLE_EXISTED));

    const newRole = new Role(data);
    const result = await newRole.save();
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_getRoles = async (req, res, next) => {
  try {
    const results = await Role.find();

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  db_createRole,
  db_getRoles,
};
