import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const deleteRootRoomResolver = async (obj, { name }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const rootRoom = await ChatService.getRootRoomByName({ name });

  const result = await ChatService.deleteRootRoom({
    name,
  });

  // Update root room to class
  await UsersService.removeRootRoomFromClass({
    className: rootRoom.class,
  });

  return result;
};

export default deleteRootRoomResolver;
