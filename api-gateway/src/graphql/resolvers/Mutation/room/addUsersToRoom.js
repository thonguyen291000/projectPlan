import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import { UNAUTHENTICATED } from "../../../../const/errors";

const addUsersToRoomResolver = async (
  obj,
  { name, rootRoom, users },
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
    const newRoom = await ChatService.addUsersToRoom({
      room: name,
      users: data.users,
    });

    // Notification new joiner real-time
    context.pubsub.publish("NEW_JOIN_ROOM", {
      newUsersJoinRoom: newRoom
    });

    return newRoom;
  } else {
    return null;
  }
};

export default addUsersToRoomResolver;
