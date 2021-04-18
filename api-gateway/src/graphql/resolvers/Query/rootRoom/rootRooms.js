import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const rootRoomsResolver = async (obj, args, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await ChatService.getAllRootRooms();
};

export default rootRoomsResolver;
