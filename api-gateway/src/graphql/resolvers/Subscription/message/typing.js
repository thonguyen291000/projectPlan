import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const typingResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["TYPING"]);
    },
    ({ typing }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);

      if (user.rooms.indexOf(typing.room) !== -1) return true;
      return false;
    }
  ),
};

export default typingResolver;
