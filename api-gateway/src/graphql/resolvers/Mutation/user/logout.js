import UsersService from "../../../../adapters/usersService";

const logoutResolver = async (obj, { email }, context) => {
  const user = await UsersService.logout({ email });

  context.pubsub.publish("USER_OFFLINE", {
    userOffline: user,
  });

  return user;
};

export default logoutResolver;
