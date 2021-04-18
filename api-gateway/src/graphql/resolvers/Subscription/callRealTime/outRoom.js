import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const deleteMessageResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["OUT_ROOM"]);
    },
    (payload, _, { user }) => {
      return user.rooms.indexOf(payload.outRoom.room) !== -1;
    }
  ),
};

export default deleteMessageResolver;
