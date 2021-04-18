import UsersService from "../../../../adapters/usersService";

const deleteUserSessionResolver = async (obj, {sessionId }, context) => {
  await UsersService.deleteUserSession({ sessionId });

  // Remove session from cookie
  context.res.clearCookie("userSessionId");

  return true;
};

export default deleteUserSessionResolver;
