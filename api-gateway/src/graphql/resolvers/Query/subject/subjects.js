import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const subjectsResolver = async (obj, args, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.getAllSubjects();
};

export default subjectsResolver;
