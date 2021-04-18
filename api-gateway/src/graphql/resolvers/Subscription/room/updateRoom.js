import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const updateRoomResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["UPDATE_ROOM"]);
    },
    ({ updateRoom }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      if (updateRoom.users.indexOf(user.email) !== -1) return true;
      return false;
    }
  ),
};

export default updateRoomResolver;
