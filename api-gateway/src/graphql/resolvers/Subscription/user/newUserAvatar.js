import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const newUserAvatarResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["NEW_USER_AVATAR"]);
    },
    ({ newUserAvatar }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);

      for (let index = 0; index < user.rooms.length; index++) {
        const element = user.rooms[index];
        if (newUserAvatar.rooms.indexOf(element) !== -1) return true;
      }
     
      return false;
    }
  ),
};

export default newUserAvatarResolver;
