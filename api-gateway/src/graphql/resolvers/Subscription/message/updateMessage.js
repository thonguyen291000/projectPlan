import { withFilter } from "apollo-server";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateMessageResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["UPDATE_MESSAGE"]);
    },
    ({ updateMessage }, _, {user}) => {
      if(!user) throw new Error(UNAUTHENTICATED);
      if (
        updateMessage.user === user.email ||
        user.rooms.indexOf(updateMessage.room) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default updateMessageResolver;
