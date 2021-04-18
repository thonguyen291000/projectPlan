import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const messageResolver = async (obj, args, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await ChatService.getAllMessages();
};

export default messageResolver;
