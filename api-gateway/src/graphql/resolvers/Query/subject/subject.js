import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const subjectResolver = async (obj, { name }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.getSubjectByName({ name });
};

export default subjectResolver;
