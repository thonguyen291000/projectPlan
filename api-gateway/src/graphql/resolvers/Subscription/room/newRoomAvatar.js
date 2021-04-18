import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const newRoomAvatarResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["NEW_ROOM_AVATAR"]);
    },
    ({ newRoomAvatar }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      if (user.rooms.indexOf(newRoomAvatar.room) !== -1 && user.email !== newRoomAvatar.user) return true;
      return false;
    }
  ),
};

export default newRoomAvatarResolver;
