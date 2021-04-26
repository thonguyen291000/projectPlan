import got from "got";

import { CHAT_SERVICE_URL } from "./const/urls";

export default class ChatService {
  static async getAllRootRooms() {
    const results = await got.get(`${CHAT_SERVICE_URL}/rootRooms`).json();

    return results;
  }

  static async getRootRoomByName({ name }) {
    const result = await got.get(`${CHAT_SERVICE_URL}/rootRoom/${name}`).json();

    return result;
  }

  static async updateRootRoom({ rootRoom, name }) {
    const result = await got
      .patch(`${CHAT_SERVICE_URL}/rootRoom`, {
        json: {
          rootRoom,
          name,
        },
      })
      .json();

    return result;
  }

  static async deleteRootRoom({ name }) {
    const result = await got
      .delete(`${CHAT_SERVICE_URL}/rootRoom`, {
        json: {
          name,
        },
      })
      .json();

    return result;
  }

  static async getRoomByName({ name }) {
    const result = await got.get(`${CHAT_SERVICE_URL}/room/${name}/@`).json();

    return result;
  }

  static async getRoomsByName({ names, rootRoom, limit }) {
    var results = ["test"];
    var result;
    if (limit) {
      for (var i = 0; i < limit; i++) {
        result = await got
          .get(`${CHAT_SERVICE_URL}/room/${names[i]}/${rootRoom}`)
          .json();
        results.push(result);
      }
    } else {
      for (var i = 0; i < names.length; i++) {
        result = await got
          .get(`${CHAT_SERVICE_URL}/room/${names[i]}/${rootRoom}`)
          .json();
        results.push(result);
      }
    }
    results.shift();
    return results;
  }

  static async updateRoom({ room, name, avatar, event, description, status }) {
    const result = await got
      .patch(`${CHAT_SERVICE_URL}/room`, {
        json: {
          room,
          name,
          event,
          description,
          avatar,
          status,
        },
      })
      .json();

    return result;
  }

  static async addUsersToRoom({ room, users }) {
    const result = await got
      .patch(`${CHAT_SERVICE_URL}/room/users/add`, {
        json: {
          room,
          users,
        },
      })
      .json();

    return result;
  }

  static async removeUsersFromRoom({ room, users }) {
    const result = await got
      .patch(`${CHAT_SERVICE_URL}/room/users/remove`, {
        json: {
          room,
          users,
        },
      })
      .json();

    return result;
  }

  static async deleteRoom({ name, whoDeleted }) {
    const result = await got
      .delete(`${CHAT_SERVICE_URL}/room`, {
        json: {
          name,
          whoDeleted,
        },
      })
      .json();

    return result;
  }

  static async updateClassInRootRoom({ className, rootRoom }) {
    const result = await got
      .patch(`${CHAT_SERVICE_URL}/rootRoom/class`, {
        json: {
          class: className,
          rootRoom,
        },
      })
      .json();

    return result;
  }

  static async createMessage({
    content,
    user,
    room,
    filename,
    type,
    encoding,
    url,
    mimetype,
    size,
    replyToMessage,
  }) {
    const result = await got
      .post(`${CHAT_SERVICE_URL}/message`, {
        json: {
          content,
          user,
          room,
          filename,
          type,
          encoding,
          url,
          mimetype,
          size,
          replyToMessage,
        },
      })
      .json();

    return result;
  }

  static async getMessagesForARoom({ room }) {
    const results = await got
      .get(`${CHAT_SERVICE_URL}/messages/${room}`)
      .json();

    return results;
  }

  static async getAllMessages() {
    const results = await got.get(`${CHAT_SERVICE_URL}/messages`).json();
    return results;
  }

  static async getMessageById({ messageId }) {
    const result = await got
      .get(`${CHAT_SERVICE_URL}/message/${messageId}`)
      .json();
    return result;
  }

  static async getNewestMessageById({ messageId }) {
    var result = await got
      .get(`${CHAT_SERVICE_URL}/message/${messageId}`)
      .json();

    return result;
  }

  static async getMessagesByIdOneTime({ messageIds }) {
    
    var result = await got
      .get(`${CHAT_SERVICE_URL}/messages/id/${messageIds}`)
      .json();

    return result;
  }

  static async getMessagesById({ messageIds, limit }) {
    var results = [];

    if (limit) {
      for (let index = 0; index < limit; index++) {
        const messageId = messageIds[index];
        var result = await got
          .get(`${CHAT_SERVICE_URL}/message/${messageId}`)
          .json();

        if (result) {
          results.push(result);
        }
      }
    } else {
      for (let index = 0; index < messageIds.length; index++) {
        const messageId = messageIds[index];
        var result = await got
          .get(`${CHAT_SERVICE_URL}/message/${messageId}`)
          .json();

        if (result) {
          results.push(result);
        }
      }
    }

    //Sort
    results.sort((first, second) => (first._id < second._id ? 1 : -1));

    return results;
  }

  static async updateMessage({
    message,
    content,
    seen,
    fileName,
    mimetype,
    encoding,
    url,
    type,
    usersSeenMessage,
    reacts,
  }) {
    const result = await got
      .patch(`${CHAT_SERVICE_URL}/message`, {
        json: {
          message,
          content,
          seen,
          fileName,
          mimetype,
          encoding,
          url,
          type,
          usersSeenMessage,
          reacts,
        },
      })
      .json();

    return result;
  }

  static async updateMessageToRoom({ room, message }) {
    const result = await got
      .patch(`${CHAT_SERVICE_URL}/room/message`, {
        json: {
          room,
          message,
        },
      })
      .json();

    return result;
  }

  static async deleteMessage({ message }) {
    const result = await got
      .delete(`${CHAT_SERVICE_URL}/message`, {
        json: {
          message,
        },
      })
      .json();

    return result;
  }

  static async getAllRoles() {
    const results = await got.get(`${CHAT_SERVICE_URL}/roles`).json();

    return results;
  }

  static async createRootRoom({ name, description, presentClass }) {
    const result = await got
      .post(`${CHAT_SERVICE_URL}/rootRoom`, {
        json: {
          name,
          description,
          presentClass,
        },
      })
      .json();

    return result;
  }

  static async getRootRoomByName({ name }) {
    const result = await got.get(`${CHAT_SERVICE_URL}/rootRoom/${name}`).json();

    return result;
  }

  static async createRoom({
    name,
    description,
    rootRoom,
    users,
    avatar,
    whoCreated,
  }) {
    const result = await got
      .post(`${CHAT_SERVICE_URL}/room`, {
        json: {
          name,
          description,
          rootRoom,
          users,
          avatar,
          whoCreated,
        },
      })
      .json();

    return result;
  }
}
