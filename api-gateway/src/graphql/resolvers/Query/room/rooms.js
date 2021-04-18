import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const roomsResolver = async (obj, {names}, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await ChatService.getRoomsByName({names});
};

export default roomsResolver;
