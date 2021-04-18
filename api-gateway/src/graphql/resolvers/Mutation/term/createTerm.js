import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const createTermResolver = async (
  obj,
  { name, subject, description },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.createTerm({ name, subject, description });
};

export default createTermResolver;
