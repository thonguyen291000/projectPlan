import { withFilter } from "apollo-server";
import {UNAUTHENTICATED} from "../../../../const/errors"

const newMessageResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["NEW_MESSAGE"]);
    },
    ({ newMessage }, _, {user}) => {
      if(!user) throw new Error(UNAUTHENTICATED);
      if (
        newMessage.user === user.email ||
        user.rooms.indexOf(newMessage.room) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default newMessageResolver;
