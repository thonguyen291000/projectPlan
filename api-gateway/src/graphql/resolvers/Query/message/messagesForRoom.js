import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const messagesForRoomResolver = async (obj, { room }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await ChatService.getMessagesForARoom({room});
};

export default messagesForRoomResolver;
