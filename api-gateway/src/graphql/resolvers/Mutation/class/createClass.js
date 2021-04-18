import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const createClassResolver = async (
  obj,
  { name, term, description },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  return await UsersService.createClass({ name, term, description });
};

export default createClassResolver;
