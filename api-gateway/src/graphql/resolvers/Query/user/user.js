import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const userResolver = async (obj, { email }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.getUserByEmail({ email });
};

export default userResolver;
