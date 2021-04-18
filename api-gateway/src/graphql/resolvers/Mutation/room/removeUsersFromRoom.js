import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import { UNAUTHENTICATED } from "../../../../const/errors";

const removeUsersFromRoomResolver = async (obj, { room, users }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const roomObject = await ChatService.getRoomByName({ name: room });

  context.pubsub.publish("REMOVE_USERS_FROM_ROOM", {
    removeUsersFromRoom: {
      users,
      room,
    },
  });

  if (roomObject.users.length > 0) {
    await UsersService.removeRoomFromUsers({ room, users });
    return await ChatService.removeUsersFromRoom({ room, users });
  }

  return "No users in room";
};

export default removeUsersFromRoomResolver;
