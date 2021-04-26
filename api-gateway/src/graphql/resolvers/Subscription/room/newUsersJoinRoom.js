import { withFilter } from "apollo-server";
import {UNAUTHENTICATED} from "../../../../const/errors"

const newUsersJoinRoomResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["NEW_JOIN_ROOM"]);
    },
    ({ newUsersJoinRoom }, _, {user, newRooms}) => {
      if(!user) throw new Error(UNAUTHENTICATED);

      if (
        newUsersJoinRoom.users.indexOf(user.email) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default newUsersJoinRoomResolver;
