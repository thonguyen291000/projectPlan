import {
  db_createSubject,
  db_getSubjects,
  db_getSubjectByName,
  db_updateSubject,
  db_deleteSubject
} from "../../db/functions/subject";
// String const
import {
  NAME_DESCRIPTION_REQUIRED,
  NAME_REQUIRED,
  SUBJECT_REQUIRED,
} from "../../const/errors";
import {} from "../../const/commonString";
// Helpers
import { createdAt, updatedAt, deletedAt } from "../../helpers/date";

const createSubject = async (req, res, next) => {
  if (req.body.name === "") {
    return next(new Error(NAME_REQUIRED));
  }

  const data = {
    name: req.body.name,
    description: req.body.description,
    createdAt,
    updatedAt,
    deletedAt,
    terms: [],
  };

  await db_createSubject(data, req, res, next);
};

const getSubjects = async (req, res, next) => {
  await db_getSubjects(req, res, next);
};

const getSubjectByName = async (req, res, next) => {
  await db_getSubjectByName(req, res, next);
};

const updateSubject = async (req, res, next) => {
  if (req.body.subject === "") {
    return next(new Error(SUBJECT_REQUIRED));
  }

  if (req.body.name === "" && req.body.description === "") {
    return next(new Error(NAME_DESCRIPTION_REQUIRED));
  }

  await db_updateSubject(req, res, next);
};

const deleteSubject = async (req, res, next) => {
  if (req.body.name === "") {
    return next(new Error(SUBJECT_REQUIRED));
  }

  await db_deleteSubject(req, res, next);
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectByName,
  updateSubject,
  deleteSubject,
};
