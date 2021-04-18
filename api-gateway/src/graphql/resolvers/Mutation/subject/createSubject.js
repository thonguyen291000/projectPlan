import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const createSubjectResolver = async (obj, { name, description }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  return await UsersService.createSubject({ name, description });
};

export default createSubjectResolver;
