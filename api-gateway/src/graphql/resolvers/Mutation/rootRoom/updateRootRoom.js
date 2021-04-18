import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateRootRoomResolver = async (obj, { rootRoom, name }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const newRootRoom = await ChatService.updateRootRoom({
    rootRoom,
    name,
  });

  // Update root room to class
  await UsersService.updateRootRoomToClass({
    rootRoom: name,
    className: newRootRoom.class,
  });

  return newRootRoom;
};

export default updateRootRoomResolver;
