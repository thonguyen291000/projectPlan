import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const newUserOnlineResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(['NEW_USER_ONLINE_ROOM']);
    },
    (payload, __, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      return user.role === "staff";
    }
  ),
};

export default newUserOnlineResolver;
