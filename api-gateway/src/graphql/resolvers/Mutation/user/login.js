import UsersService from "../../../../adapters/usersService";
import ChatService from "../../../../adapters/chatService";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../const/token";

const loginResolver = async (obj, { email }, context) => {
  const user = await UsersService.login({ email });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "10h" });

  user.token = token;

  // Notification new user online in room to set room status
  context.pubsub.publish('USER_ONLINE', {
    userOnline: user
  });

  context.pubsub.publish('NEW_USER_ONLINE_ROOM', {
    newUserOnlineRoom: user
  })

  if (user.rooms.length > 0) {
    //Update status on databases
    for await (const roomName of user.rooms) {
      ChatService.updateRoom({ room: roomName, status: "online" });
    }
  }

  return user;
};

export default loginResolver;
