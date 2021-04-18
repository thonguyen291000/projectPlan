exports.createdAt = new Date().toGMTString();
exports.deletedAt = new Date().toGMTString();
exports.updatedAt = new Date().toGMTString();

exports.formatDate = (date) => new Date(date).toGMTString();