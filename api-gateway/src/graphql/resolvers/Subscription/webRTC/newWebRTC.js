import { withFilter } from "apollo-server";
import {UNAUTHENTICATED} from "../../../../const/errors"

const newWebRTCResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["NEW_WEBRTC"]);
    },
    ({ data }, _, {user}) => {
      if(!user) throw new Error(UNAUTHENTICATED);
      if (
        user.rooms.indexOf(data.room) !== -1
      )
        return true;
      return false;
    }
  ),
};

export default newWebRTCResolver;
