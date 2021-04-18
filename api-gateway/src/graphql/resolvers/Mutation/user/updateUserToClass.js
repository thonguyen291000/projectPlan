import UsersService from "../../../../adapters/usersService";
import {UNAUTHENTICATED} from "../../../../const/errors"

const updateUserToClassResolver = async (obj, { email, className }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  return await UsersService.updateUserToClass({ email, className });
};

export default updateUserToClassResolver;
