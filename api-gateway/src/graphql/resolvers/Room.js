import UsersService from "../../adapters/usersService";
import ChatService from "../../adapters/chatService";

const Room = {
  users: async (room) => {
    return await UsersService.getUsersByEmail({ emails: room.users });
  },

  rootRoom: async (room) => {
    return await ChatService.getRootRoomByName({ name: room.rootRoom });
  },

  messages: async (room, { offset, limit }) => {
    var messages = room.messages.reverse();

    if (offset) {
      var indexToSplit = messages.indexOf(offset);
      var validIds = messages.slice(indexToSplit + 1);

      return await ChatService.getMessagesById({
        messageIds: validIds,
        limit,
      });
    } else {
      return await ChatService.getMessagesById({
        messageIds: messages,
        limit,
      });
    }
  },

  newestMessage: async (room) => {
    const messageId = room.messages[room.messages.length - 1];
    return await ChatService.getNewestMessageById({
      messageId,
    });
  },
};

export default Room;
