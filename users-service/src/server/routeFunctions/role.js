import { db_createRole, db_getRoles } from "../../db/functions/role";
// String const
import { ROLE_REQUIRED } from "../../const/errors";
// Helpers
import { createdAt } from "../../helpers/date";

const createRole = async (req, res, next) => {
  if (req.body.role === "") {
    return next(new Error(ROLE_REQUIRED));
  }

  const data = {
    role: req.body.role,
    createdAt,
  };

  await db_createRole(data, req, res, next);
};

const getRoles = async (req, res, next) => {
  await db_getRoles(req, res, next);
};

module.exports = {
  createRole,
  getRoles,
};
