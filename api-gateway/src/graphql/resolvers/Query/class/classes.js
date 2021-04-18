import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const classesResolver = async (obj, args, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.getAllClasses();
};

export default classesResolver;
