import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const deleteTermResolver = async (
  obj,
  { name },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.deleteTerm({ name });
};

export default deleteTermResolver;
