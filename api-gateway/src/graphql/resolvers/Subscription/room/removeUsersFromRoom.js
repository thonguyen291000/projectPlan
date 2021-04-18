import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const removeUsersFromRoomResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(['REMOVE_USERS_FROM_ROOM']);
    },
    (payload, __, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      if(payload.removeUsersFromRoom.users.indexOf(user.email) !== -1) {
          console.log(user.email)
          return true
      }
      return false;
    }
  ),
};

export default removeUsersFromRoomResolver;
