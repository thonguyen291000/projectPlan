import moment from "moment";

exports.createdAt = new Date().toISOString();
exports.deletedAt = moment(new Date()).add(4, "months").toISOString();
exports.updatedAt = new Date().toISOString();

exports.formatDate = (date) => new Date(date).toISOString();