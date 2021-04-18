import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const newRoomResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["NEW_ROOM"]);
    },
    ({ newRoom }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      if (newRoom.users.indexOf(user.email) !== -1 || user.role === "admin")
        return true;
      return false;
    }
  ),
};

export default newRoomResolver;
