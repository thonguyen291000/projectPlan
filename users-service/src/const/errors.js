exports.NAME_REQUIRED = "Name is required";
exports.EMAIL_REQUIRED = "Email is required";
exports.PASSWORD_REQUIRED = "Password is required";
exports.ROLE_REQUIRED = "Role is required";
exports.ID_USER_REQUIRED = "User id is required";
exports.USER_REQUIRED = "User email is required";
exports.USER_EXISTED = "User is existed";
exports.SESSION_EXISTED = "The user already has had a session";
exports.INVALID_EMAIL = "Invalid email!";
exports.INCORRECT_PASSWORD = "Incorrect password!";
exports.INCORRECT_EMAIL = "Incorrect email!";
exports.INCORRECT_USER_ID = "Incorrect user ID!";
exports.INCORRECT_SESSION_ID = "Incorrect session ID!";
exports.USER_NOT_FOUND = "User not found";
exports.USER_IN_CLASS = "User have joined that class";
exports.MESSAGE_REQUIRED = "Message is required";
exports.MESSAGE_IN_USER = "Message have added in user";
exports.UPDATE_DATA_USER_REQUIRED = "Password or user name or avatar url is required";
exports.USER_NOT_IN_CLASS = (user, className) =>
  `User ${user} is not in class ${className}`;

exports.SUBJECT_EXISTED = "Subject is existed";
exports.SUBJECT_NOT_FOUND = "Subject not found";
exports.SUBJECT_REQUIRED = "Subject is required";
exports.INCORRECT_SUBJECT = "Subject is incorrect";
exports.TERMS_MUST_EMPTY = "Terms must be empty before deleting";

exports.TERM_EXISTED = "Term is existed";
exports.TERM_NOT_FOUND = "Term not found";
exports.TERM_REQUIRED = "Term is required";
exports.INCORRECT_TERM = "Term is incorrect";
exports.CLASSES_MUST_EMPTY = "Classes must be empty before deleting";

exports.CLASS_EXISTED = "Class is existed";
exports.CLASS_NOT_FOUND = "Class not found";
exports.CLASS_REQUIRED = "Class is required";
exports.NAME_DESCRIPTION_REQUIRED = "Class name or description is required";
exports.ROOT_ROOM_USER_MUST_EMPTY =
  "Root room or users must be empty before deleting";

exports.ROLE_EXISTED = "Role is existed";
exports.ROLE_REQUIRED = "Role is required";

exports.ROOM_REQUIRED = "Room is required";
exports.ROOT_ROOM_REQUIRE = "Root room is required";
