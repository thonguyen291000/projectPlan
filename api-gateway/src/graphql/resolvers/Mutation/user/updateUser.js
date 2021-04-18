import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateUserResolver = async (obj, { email, name, password, avatar, seenRooms }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.updateUser({ email, name, password, avatar, seenRooms });
};

export default updateUserResolver;
