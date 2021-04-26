import UsersService from "../../adapters/usersService";
import ChatService from "../../adapters/chatService";

const User = {
  classes: async (user) => {
    return await UsersService.getClassesByName({ names: user.classes });
  },
  rooms: async (user, { rootRoom, offset, limit }) => {
    var rooms = user.rooms.reverse();

    rooms = rooms.filter(room => room.includes(`|${rootRoom}`));

    if (offset) {
      var indexToSplit = rooms.indexOf(offset);
      var validNames = rooms.slice(indexToSplit + 1);
      return await ChatService.getRoomsByName({ names: validNames, rootRoom, limit });
    } else {
      return await ChatService.getRoomsByName({ names: rooms, rootRoom, limit });
    }
  },
  messages: async (user) => {
    return await ChatService.getMessagesById({ messageIds: user.messages });
  },
};

export default User;
