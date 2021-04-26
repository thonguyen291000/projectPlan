import { withFilter } from "apollo-server";
import UsersService from "../../../../adapters/usersService";
import { UNAUTHENTICATED } from "../../../../const/errors";

const deleteMessageResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["OUT_ROOM"]);
    },
    async (payload, _, { user }) => {

      const userObj = await UsersService.getUserByEmail({email: user.email});

      return userObj.rooms.indexOf(payload.outRoom.room) !== -1;
    }
  ),
};

export default deleteMessageResolver;
