import { withFilter } from "apollo-server";
import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateMessageResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["UPDATE_MESSAGE"]);
    },
    async ({ updateMessage }, _, {user}) => {
      if(!user) throw new Error(UNAUTHENTICATED);

      const userObj = await UsersService.getUserByEmail({email: user.email});

      if (
        updateMessage.user === user.email ||
        userObj.rooms.indexOf(updateMessage.room) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default updateMessageResolver;
