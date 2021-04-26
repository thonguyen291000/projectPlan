import { withFilter } from "apollo-server";
import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const joinRoomResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["JOIN_ROOM"]);
    },
    async (payload, _, {user}) => {
      
      const userObj = await UsersService.getUserByEmail({email: user.email});

      return userObj.rooms.indexOf(payload.joinRoom.room) !== -1;
     
    }
  ),
};

export default joinRoomResolver;
