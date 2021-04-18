import UsersService from "../adapters/usersService";

const injectSession = async (req, res, next) => {
  if (req.cookies.userSessionId) {
    const userSession = await UsersService.getUserSession({
      sessionId: req.cookies.userSessionId,
    });

    const user = await UsersService.getUserById({ userId: userSession.user });

    res.locals.userSession = userSession;
    res.locals.user = user;
  }

  return next();
};

export default injectSession;
