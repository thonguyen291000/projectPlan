import got from "got";

import { USERS_SERVICE_URL } from "./const/urls";

export default class UsersService {
  static async login({ email }) {
    const result = await got
      .post(`${USERS_SERVICE_URL}/login`, {
        json: {
          email,
        },
      })
      .json();

    return result;
  }

  static async logout({ email }) {
    const result = await got
      .post(`${USERS_SERVICE_URL}/logout`, {
        json: {
          email,
        },
      })
      .json();

    return result;
  }

  static async createUser({ email, password, name, role }) {
    const result = await got
      .post(`${USERS_SERVICE_URL}/user`, {
        json: {
          email,
          password,
          name,
          role,
        },
      })
      .json();

    return result;
  }

  static async getAllUser() {
    const results = await got.get(`${USERS_SERVICE_URL}/users`).json();

    return results;
  }

  static async getUserById({ userId }) {
    const result = await got
      .get(`${USERS_SERVICE_URL}/user/id/${userId}`)
      .json();
    return result;
  }

  static async getUserByEmail({ email }) {
    const result = await got.get(`${USERS_SERVICE_URL}/user/${email}`).json();

    return result;
  }

  static async getUsersByEmail({ emails }) {
    var results = ["test"];
    var result;
    for (var i = 0; i < emails.length; i++) {
      result = await got.get(`${USERS_SERVICE_URL}/user/${emails[i]}`).json();
      results.push(result);
    }
    results.shift();
    return results;
  }

  static async updateUser({ email, name, password, avatar, seenRooms }) {
    var result = await got
      .patch(`${USERS_SERVICE_URL}/user`, {
        json: {
          email,
          name,
          password,
          avatar,
          seenRooms,
        },
      })
      .json();

    return result;
  }

  static async updateUserToClass({ email, className }) {
    var result = await got
      .patch(`${USERS_SERVICE_URL}/user/class`, {
        json: {
          email,
          class: className,
        },
      })
      .json();

    return result;
  }

  static async updateUserToClasses({ email, classNames }) {
    var result = await got
      .patch(`${USERS_SERVICE_URL}/user/classes`, {
        json: {
          email,
          classes: classNames,
        },
      })
      .json();

    return result;
  }

  static async updateRoomInUsers({ room, users }) {
    const result = await got.patch(`${USERS_SERVICE_URL}/users/roomName`, {
      json: {
        room,
        users,
      },
    });

    return result;
  }

  static async removeRoomFromUsers({ room, users }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/users/room/remove`, {
        json: {
          room,
          users,
        },
      })
      .json();

    return result;
  }

  static async removeMessageFromUser({ message, user }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/user/message/remove`, {
        json: {
          message,
          user,
        },
      })
      .json();

    return result;
  }

  static async deleteUser({ email }) {
    var result = await got
      .delete(`${USERS_SERVICE_URL}/user`, {
        json: {
          email,
        },
      })
      .json();

    return result;
  }

  static async createUserSession({ email, password }) {
    const result = await got
      .post(`${USERS_SERVICE_URL}/session`, {
        json: {
          email,
          password,
        },
      })
      .json();

    return result;
  }

  static async deleteUserSession({ sessionId }) {
    const result = await got
      .delete(`${USERS_SERVICE_URL}/session/${sessionId}`)
      .json();

    return result;
  }

  static async getUserSession({ sessionId }) {
    try {
      const result = await got
        .get(`${USERS_SERVICE_URL}/session/${sessionId}`)
        .json();

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async createSubject({ name, description }) {
    try {
      const result = await got
        .post(`${USERS_SERVICE_URL}/subject`, {
          json: {
            name,
            description,
          },
        })
        .json();

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllSubjects() {
    const results = await got.get(`${USERS_SERVICE_URL}/subjects`).json();

    return results;
  }

  static async getSubjectByName({ name }) {
    const result = await got.get(`${USERS_SERVICE_URL}/subject/${name}`).json();

    return result;
  }

  static async updateSubject({ subject, name, description }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/subject`, {
        json: {
          subject,
          name,
          description,
        },
      })
      .json();

    return result;
  }

  static async deleteSubject({ name }) {
    const result = await got
      .delete(`${USERS_SERVICE_URL}/subject`, {
        json: {
          name,
        },
      })
      .json();

    return result;
  }

  static async createTerm({ name, subject, description }) {
    const result = await got
      .post(`${USERS_SERVICE_URL}/term`, {
        json: {
          name,
          subject,
          description,
        },
      })
      .json();

    return result;
  }

  static async getAllTerms() {
    const result = await got.get(`${USERS_SERVICE_URL}/terms`).json();

    return result;
  }

  static async getTermByName({ name }) {
    const result = await got.get(`${USERS_SERVICE_URL}/term/${name}`).json();

    return result;
  }

  static async getTermsByName({ names }) {
    var results = ["test"];
    var result;
    for (var i = 0; i < names.length; i++) {
      result = await got.get(`${USERS_SERVICE_URL}/term/${names[i]}`).json();
      results.push(result);
    }
    console.log(results);
    results.shift();
    return results;
  }

  static async updateTerm({ term, name, description }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/term`, {
        json: {
          term,
          name,
          description,
        },
      })
      .json();

    return result;
  }

  static async deleteTerm({ name }) {
    const result = await got
      .delete(`${USERS_SERVICE_URL}/term`, {
        json: {
          name,
        },
      })
      .json();

    return result;
  }

  static async createClass({ name, term, description }) {
    const result = await got
      .post(`${USERS_SERVICE_URL}/class`, {
        json: {
          name,
          term,
          description,
        },
      })
      .json();

    return result;
  }

  static async getAllClasses() {
    const results = await got.get(`${USERS_SERVICE_URL}/classes`).json();

    return results;
  }

  static async getClassByName({ name }) {
    const result = await got.get(`${USERS_SERVICE_URL}/class/${name}`).json();

    return result;
  }

  static async getClassesByName({ names }) {
    var results = ["test"];
    var result;
    for (var i = 0; i < names.length; i++) {
      result = await got.get(`${USERS_SERVICE_URL}/class/${names[i]}`).json();
      results.push(result);
    }
    results.shift();
    return results;
  }

  static async updateRootRoomToClass({ rootRoom, className }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/class/rootRoom`, {
        json: {
          rootRoom,
          class: className,
        },
      })
      .json();

    return result;
  }

  static async removeRootRoomFromClass({ className }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/class/rootRoom/remove`, {
        json: {
          class: className,
        },
      })
      .json();

    return result;
  }

  static async removeUsersFromClass({ whichClass, users }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/class/users/remove`, {
        json: {
          class: whichClass,
          users,
        },
      })
      .json();

    return result;
  }

  static async updateClass({ whichClass, name, description }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/class`, {
        json: {
          class: whichClass,
          name,
          description,
        },
      })
      .json();

    return result;
  }

  static async deleteClass({ name }) {
    const result = await got
      .delete(`${USERS_SERVICE_URL}/class`, {
        json: {
          name,
        },
      })
      .json();

    return result;
  }

  static async updateMessageToUser({ user, messageId }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/user/message`, {
        json: {
          user: user,
          message: messageId,
        },
      })
      .json();

    if (result._id) return true;
    return false;
  }

  static async updateRoomToUser({ room, user }) {
    const result = await got
      .patch(`${USERS_SERVICE_URL}/user/room`, {
        json: {
          room,
          user,
        },
      })
      .json();

    return result;
  }

  static async updateUsersToRoom({ room, users, className }) {
    {
      const results = await got
        .patch(`${USERS_SERVICE_URL}/users/room`, {
          json: {
            room,
            users,
            class: className,
          },
        })
        .json();

      return results;
    }
  }

  static async deleteRoomFromUser({ room, user }) {
    const result = await got.patch(`${USERS_SERVICE_URL}/user/room/delete`, {
      json: {
        room,
        user,
      },
    });

    return result;
  }

  static async getAllRoles() {
    const results = await got.get(`${USERS_SERVICE_URL}/roles`).json();
    return results;
  }
}
