import {
  db_createTerm,
  db_getTerms,
  db_getTermByName,
  db_updateTerm,
  db_deleteTerm
} from "../../db/functions/term";
// String const
import {
  NAME_DESCRIPTION_REQUIRED,
  NAME_REQUIRED,
  SUBJECT_REQUIRED,
  TERM_REQUIRED,
} from "../../const/errors";
import {} from "../../const/commonString";
// Helpers
import { createdAt, updatedAt, deletedAt } from "../../helpers/date";

const createTerm = async (req, res, next) => {
  if (req.body.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  if (req.body.subject === "") {
    return next(new Error(SUBJECT_REQUIRED));
  }

  const data = {
    name: req.body.name,
    description: req.body.description,
    createdAt,
    updatedAt,
    deletedAt,
    classes: [],
    subject: req.body.subject,
  };

  await db_createTerm(data, req, res, next);
};

const getTerms = async (req, res, next) => {
  await db_getTerms(req, res, next);
};

const getTermByName = async (req, res, next) => {
  await db_getTermByName(req, res, next);
};

const updateTerm = async (req, res, next) => {
  if (req.body.term === "") {
    return next(new Error(TERM_REQUIRED));
  }

  if (req.body.name === "" && req.body.description === "") {
    return next(new Error(NAME_DESCRIPTION_REQUIRED));
  }

  await db_updateTerm(req, res, next);
};

const deleteTerm = async (req, res, next) => {

  if(req.body.name === "") {
    return next(new Error(TERM_REQUIRED))
  }

  await db_deleteTerm(req, res, next);
}

module.exports = {
  createTerm,
  getTerms,
  getTermByName,
  updateTerm,
  deleteTerm
};
