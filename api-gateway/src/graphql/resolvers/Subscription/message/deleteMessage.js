import { withFilter } from "apollo-server";
import {UNAUTHENTICATED} from "../../../../const/errors"

const deleteMessageResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["DELETE_MESSAGE"]);
    },
    ({ deleteMessage }, _, {user}) => {
      if(!user) throw new Error(UNAUTHENTICATED);
      if (
        deleteMessage.user === user.email ||
        user.rooms.indexOf(deleteMessage.room) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default deleteMessageResolver;
