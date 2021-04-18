import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import { UNAUTHENTICATED } from "../../../../const/errors";

const updateRoomResolver = async (
  obj,
  { room, name, avatar, event, description },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  console.log(event)
  const newRoom = await ChatService.updateRoom({
    room,
    name,
    avatar,
    event,
    description,
  });

  // Update all users if update room name
  if (newRoom) {
    if (name !== "" && newRoom.users.length > 0) {
      await UsersService.updateRoomInUsers({
        room: { oldName: room, newName: name },
        users: newRoom.users,
      });
    }

    context.pubsub.publish("UPDATE_ROOM", {
      updateRoom: {
        ...newRoom,
        oldName: room,
        users: newRoom.users,
      },
    });

    return newRoom;
  }
};

export default updateRoomResolver;
