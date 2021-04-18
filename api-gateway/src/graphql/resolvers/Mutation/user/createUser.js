import UsersService from "../../../../adapters/usersService";

const createUserResolver = async (
  obj,
  { email, password, name, role, classNames }
) => {
  const user = await UsersService.createUser({ email, password, name, role });
  if (user) {
    const finalUser = await UsersService.updateUserToClasses({
      email,
      classNames,
    });
    return finalUser;
  }
};

export default createUserResolver;
