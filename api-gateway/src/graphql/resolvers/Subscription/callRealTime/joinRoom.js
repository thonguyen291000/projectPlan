import { withFilter } from "apollo-server";
import {UNAUTHENTICATED} from "../../../../const/errors"

const joinRoomResolver = {
  subscribe: withFilter(
    (_, __, {pubsub}) => {
      return pubsub.asyncIterator(["JOIN_ROOM"]);
    },
    (payload, _, {user}) => {
      
        return user.rooms.indexOf(payload.joinRoom.room) !== -1;
     
    }
  ),
};

export default joinRoomResolver;
