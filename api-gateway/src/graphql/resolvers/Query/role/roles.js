import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const rolesResolver = async (obj, args, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.getAllRoles();
};

export default rolesResolver;
