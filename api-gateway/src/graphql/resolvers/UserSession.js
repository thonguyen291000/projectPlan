import UsersService from "../../adapters/usersService";

const UserSession = {
  user: async (userSession) => {
    return await UsersService.getUser({ userId: userSession.user });
  },
};

export default UserSession;
