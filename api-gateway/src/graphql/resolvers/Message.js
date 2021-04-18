import ChatService from "../../adapters/chatService";
import UsersService from "../../adapters/usersService";

const Message = {
  user: async (message) => {
    return await UsersService.getUserByEmail({ email: message.user });
  },
  room: async (message) => {
    return await ChatService.getRoomByName({ name: message.room });
  },
  replyToMessage: async (message) => {
    return await ChatService.getMessageById({
      messageId: message.replyToMessage,
    });
  },
};

export default Message;
