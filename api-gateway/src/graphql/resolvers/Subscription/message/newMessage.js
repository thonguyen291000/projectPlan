import { withFilter } from "apollo-server";
import UsersService from "../../../../adapters/usersService";
import { UNAUTHENTICATED } from "../../../../const/errors";

const newMessageResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["NEW_MESSAGE"]);
    },
    async ({ newMessage }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      
      const userObj = await UsersService.getUserByEmail({email: user.email});
      
      if (
        newMessage.user === user.email ||
        userObj.rooms.indexOf(newMessage.room) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default newMessageResolver;
