import Term from "../models/term";
import Subject from "../models/subject";
import Class from "../models/class";

// String const
import {
  TERM_EXISTED,
  TERM_NOT_FOUND,
  INCORRECT_SUBJECT,
  CLASSES_MUST_EMPTY,
} from "../../const/errors";

import { DELETE_SUCCESS } from "../../const/commonString";

const db_createTerm = async (data, req, res, next) => {
  try {
    const terms = await Term.find({ name: data.name });

    // Check user existed ?
    if (terms.length !== 0) return next(new Error(TERM_EXISTED));

    // Find related subject
    const relatedSubject = await Subject.findOne({ name: data.subject });

    if (!relatedSubject) return next(new Error(INCORRECT_SUBJECT));

    const term = new Term(data);
    const result = await term.save();

    // Update subject
    relatedSubject.terms.push(result.name);
    await relatedSubject.save();

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const db_getTerms = async (req, res, next) => {
  try {
    const results = await Term.find();

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const db_getTermByName = async (req, res, next) => {
  try {
    const term = await Term.findOne({ name: req.params.name });

    if (!term) return next(new Error(TERM_NOT_FOUND));

    return res.status(200).json(term);
  } catch (error) {
    next(error);
  }
};

const db_updateTerm = async (req, res, next) => {
  try {
    const term = await Term.findOne({ name: req.body.term });

    if (!term) return next(new Error(TERM_NOT_FOUND));

    if (req.body.description !== "") {
      term.description = req.body.description;
    }

    if (req.body.name !== "") {
      const anotherTerm = await Term.findOne({ name: req.body.name });

      if (anotherTerm) return next(new Error(TERM_EXISTED));

      const subject = await Subject.findOne({ name: term.subject });
      if (subject.terms.length > 1) {
        subject.terms = subject.terms.filter((item) => item !== term.name);
        subject.terms.push(req.body.name);
      } else {
        subject.terms = [req.body.name];
      }

      await subject.save();

      term.name = req.body.name;

      for await (const className of term.classes) {
        const classObject = await Class.findOne({ name: className });
        classObject.term = req.body.name;
        await classObject.save();
      }
    }

    term.updatedAt = new Date();

    await term.save();

    return res.status(201).json(term);
  } catch (error) {
    next();
  }
};

const db_deleteTerm = async (req, res, next) => {
  try {
    const term = await Term.findOne({ name: req.body.name });

    if (!term) return next(new Error(TERM_NOT_FOUND));

    if (term.classes.length > 0) {
      return next(new Error(CLASSES_MUST_EMPTY));
    }

    if (term.subject !== "") {
      const subject = await Subject.findOne({ name: term.subject });

      if (subject.terms.length > 1) {
        subject.terms = subject.terms.filter((item) => item !== term.name);
      } else {
        subject.terms = [];
      }

      await subject.save();
    }

    // Delete
    await term.remove();

    return res.status(201).json(DELETE_SUCCESS);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  db_createTerm,
  db_getTerms,
  db_getTermByName,
  db_updateTerm,
  db_deleteTerm,
};
