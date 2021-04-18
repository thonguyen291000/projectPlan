import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const userOnlineResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["USER_ONLINE"]);
    },
    ({ userOnline }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      if (user.role === "staff") return true;
      return false;
    }
  ),
};

export default userOnlineResolver;
