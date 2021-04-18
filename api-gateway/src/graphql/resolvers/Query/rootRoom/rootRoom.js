import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const rootRoomResolver = async (obj, { name }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await ChatService.getRootRoomByName({ name });
};

export default rootRoomResolver;
