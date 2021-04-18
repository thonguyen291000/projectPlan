import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const createRoomResolver = async (
  obj,
  { name, description, rootRoom, users, avatar, whoCreated },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const rootRoomObject = await ChatService.getRootRoomByName({
    name: rootRoom,
  });

  const data = await UsersService.updateUsersToRoom({
    room: name,
    users,
    className: rootRoomObject.class,
  });

  if (data.users.length > 0) {
    const newRoom = await ChatService.createRoom({
      name,
      description,
      rootRoom,
      users: data.users,
      avatar,
      whoCreated
    });

    // Notification new room real-time
    context.pubsub.publish("NEW_ROOM", { newRoom: newRoom });

    return newRoom;
  } else {
    return null;
  }
};

export default createRoomResolver;
