import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const classResolver = async (obj, { name }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.getClassByName({ name });
};

export default classResolver;
