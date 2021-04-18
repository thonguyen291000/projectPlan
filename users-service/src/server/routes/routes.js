import routesUser from "../routes/routesUser";
import routesUserFunc from "../routeFunctions/user";
import routesSubject from "../routes/routesSubject";
import routesSubjectFunc from "../routeFunctions/subject";
import routesTerm from "../routes/routesTerm";
import routesTermFunc from "../routeFunctions/term";
import routesClass from "../routes/routesClass";
import routesClassFunc from "../routeFunctions/class";
import routesRole from "../routes/routesRole";
import routesRoleFunc from "../routeFunctions/role";

const setupRoutes = (app) => {
  routesUser(app, routesUserFunc);
  routesSubject(app, routesSubjectFunc);
  routesTerm(app, routesTermFunc);
  routesClass(app, routesClassFunc);
  routesRole(app, routesRoleFunc);
};

export default setupRoutes;
