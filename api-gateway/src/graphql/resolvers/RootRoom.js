import UsersService from "../../adapters/usersService";
import ChatService from "../../adapters/chatService";

const RootRoom = {
  rooms: async (rootRoom) => {
    return await ChatService.getRoomsByName({ names: rootRoom.rooms });
  },
  class: async (rootRoom) => {
    return await UsersService.getClassByName({ name: rootRoom.class });
  },
};

export default RootRoom;
