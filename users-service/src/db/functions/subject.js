import Subject from "../models/subject";
import Term from "../models/term";

// String const
import {
  SUBJECT_EXISTED,
  SUBJECT_NOT_FOUND,
  TERMS_MUST_EMPTY,
} from "../../const/errors";
import { DELETE_SUCCESS } from "../../const/commonString";

const db_createSubject = async (data, req, res, next) => {
  try {
    const subjects = await Subject.find({ name: data.name });

    // Check user existed ?
    if (subjects.length !== 0) return next(new Error(SUBJECT_EXISTED));

    const subject = new Subject(data);
    const result = await subject.save();
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_getSubjects = async (req, res, next) => {
  try {
    const results = await Subject.find();

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const db_getSubjectByName = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ name: req.params.name });

    if (!subject) return next(new Error(SUBJECT_NOT_FOUND));

    return res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

const db_updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ name: req.body.subject });

    if (!subject) return next(new Error(SUBJECT_NOT_FOUND));

    if (req.body.description !== "") {
      subject.description = req.body.description;
    }

    if (req.body.name !== "") {
      const anotherSubject = await Subject.findOne({ name: req.body.name });

      if (anotherSubject) return next(new Error(SUBJECT_EXISTED));

      subject.name = req.body.name;

      if (subject.terms.length > 0) {
        for await (const termName of subject.terms) {
          const term = await Term.findOne({ name: termName });

          term.subject = req.body.name;
          await term.save();
        }
      }
    }
    
    subject.updatedAt = new Date();

    // Update
    await subject.save();

    return res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

const db_deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ name: req.body.name });

    if (!subject) return next(new Error(SUBJECT_NOT_FOUND));

    if (subject.terms.length > 0) return next(new Error(TERMS_MUST_EMPTY));

    await subject.remove();

    return res.status(201).json(DELETE_SUCCESS);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  db_createSubject,
  db_getSubjects,
  db_getSubjectByName,
  db_updateSubject,
  db_deleteSubject,
};
