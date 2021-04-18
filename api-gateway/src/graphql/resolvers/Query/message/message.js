import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const messageResolver = async (obj, { messageId }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await ChatService.getMessageById({ messageId });
};

export default messageResolver;
