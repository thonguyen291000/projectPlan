import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const deleteUserResolver = async (obj, { email }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.deleteUser({ email });
};

export default deleteUserResolver;
