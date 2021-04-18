import { withFilter } from "apollo-server";
import { UNAUTHENTICATED } from "../../../../const/errors";

const userOfflineResolver = {
  subscribe: withFilter(
    (_, __, { pubsub }) => {
      return pubsub.asyncIterator(["USER_OFFLINE"]);
    },
    ({ userOffline }, _, { user }) => {
      if (!user) throw new Error(UNAUTHENTICATED);
      if (user.role === "staff") return true;
      return false;
    }
  ),
};

export default userOfflineResolver;
