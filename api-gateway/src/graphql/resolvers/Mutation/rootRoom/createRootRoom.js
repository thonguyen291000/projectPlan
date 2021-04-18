import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const createRootRoomResolver = async (
  obj,
  { name, description, presentClass },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const newRootRoom = await ChatService.createRootRoom({
    name,
    description,
    presentClass,
  });

  // Update root room to class
  await UsersService.updateRootRoomToClass({ rootRoom: name, className: presentClass });

  return newRootRoom;
};

export default createRootRoomResolver;
