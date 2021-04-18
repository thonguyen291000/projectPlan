import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const removeUsersFromClassResolver = async (
  obj,
  { whichClass, users },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  return await UsersService.removeUsersFromClass({ whichClass, users });
};

export default removeUsersFromClassResolver;
