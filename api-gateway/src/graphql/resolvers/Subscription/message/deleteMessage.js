import { withFilter } from "apollo-server";
import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const deleteMessageResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["DELETE_MESSAGE"]);
    },
    async ({ deleteMessage }, _, {user}) => {
      if(!user) throw new Error(UNAUTHENTICATED);

      const userObj = await UsersService.getUserByEmail({email: user.email});

      if (
        deleteMessage.user === user.email ||
        userObj.rooms.indexOf(deleteMessage.room) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default deleteMessageResolver;
