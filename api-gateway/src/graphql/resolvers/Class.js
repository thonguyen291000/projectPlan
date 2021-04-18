import UsersService from "../../adapters/usersService";
import ChatService from "../../adapters/chatService";

const Class = {

  rootRoom: async (classObject) => {
    return await ChatService.getRootRoomByName({name: classObject.rootRoom});
  },

  term: async (classObject) => {
    return await UsersService.getTermByName({ name: classObject.term });
  },

  users: async (classObject) => {
    if (classObject.users.length > 0) {
      return await UsersService.getUsersByEmail({ emails: classObject.users });
    }
  }
};

export default Class;
