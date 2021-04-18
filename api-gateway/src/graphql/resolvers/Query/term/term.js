import UsersService from "../../../../adapters/usersService";

const termResolver = async (obj, {name}) => {
  return await UsersService.getTermByName({name});
};

export default termResolver;