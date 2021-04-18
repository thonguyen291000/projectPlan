import rootRoomFunc from "../routeFunctions/rootRoom";
import roomFunc from "../routeFunctions/room";
import messageFunc from "../routeFunctions/message";
import rootRoom from "./routesRootRoom";
import room from "./routesRoom";
import message from "./routesMessage";

const setupRoutes = (app) => {
  rootRoom(app, rootRoomFunc);
  room(app, roomFunc);
  message(app, messageFunc);
};

export default setupRoutes;
