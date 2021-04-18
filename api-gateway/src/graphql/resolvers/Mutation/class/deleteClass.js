import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const deleteClassResolver = async (
  obj,
  { name },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  return await UsersService.deleteClass({ name });
};

export default deleteClassResolver;
