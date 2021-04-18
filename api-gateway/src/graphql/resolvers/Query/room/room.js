import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const roomResolver = async (obj, { name }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  var room = await ChatService.getRoomByName({ name });

  //Check user status to set room status
  const isAnyUserOnline = room.users.filter((user) => user.status === "online");

  if(isAnyUserOnline.length === 0) {
    room.status = "offline";
  } else {
    room.status = "online";
  }

  return room;

};

export default roomResolver;