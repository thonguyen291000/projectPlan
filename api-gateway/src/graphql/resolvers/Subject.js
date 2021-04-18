import UsersService from "../../adapters/usersService";

const Subject = {
  terms: async (subject) => {
    if(subject.terms.length !== 0) {
      return await UsersService.getTermsByName({ names: subject.terms });
    }
  },
};

export default Subject;