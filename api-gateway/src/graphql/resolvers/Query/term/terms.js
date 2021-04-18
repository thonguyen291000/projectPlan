import UsersService from "../../../../adapters/usersService";

const termsResolver = async () => {
  return await UsersService.getAllTerms();
};

export default termsResolver;