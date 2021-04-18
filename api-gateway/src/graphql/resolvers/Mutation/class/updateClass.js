import UsersService from "../../../../adapters/usersService";
import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateClassResolver = async (obj, { whichClass, name, description }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const updatedClass = await UsersService.updateClass({ whichClass, name, description });

  // Update class in root room
  if (name !== "" && updatedClass.rootRoom) {
    await ChatService.updateClassInRootRoom({
      className: name,
      rootRoom: updatedClass.rootRoom,
    });
  }

  return updatedClass;
};

export default updateClassResolver;
