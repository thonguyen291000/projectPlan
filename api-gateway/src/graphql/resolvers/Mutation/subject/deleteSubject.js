import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const deleteSubjectResolver = async (obj, { name }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  return await UsersService.deleteSubject({ name });
};

export default deleteSubjectResolver;
