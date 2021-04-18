import UsersService from "../../adapters/usersService";

const Term = {
  classes: async (term) => {
    if(term.classes.length !== 0) {
      return await UsersService.getClassesByName({ names: term.classes });
    }
  },
  subject: async (term) => {
    return await UsersService.getSubjectByName({name: term.subject});
  }
};

export default Term;