import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateSubjectResolver = async (obj, { subject, name, description }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  return await UsersService.updateSubject({ subject, name, description });
};

export default updateSubjectResolver;
