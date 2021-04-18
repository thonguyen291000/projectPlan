import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateTermResolver = async (
  obj,
  { term, name, description },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.updateTerm({ term, name, description });
};

export default updateTermResolver;
