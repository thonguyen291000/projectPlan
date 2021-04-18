const routesRoom = (app, functions) => {
  app.get("/rooms", async (req, res, next) => {
    await functions.getRooms(req, res, next);
  });

  app.get("/room/:name/:rootRoom", async (req, res, next) => {
    await functions.getRoomByName(req, res, next);
  });

  app.get("/rooms/:names/:rootRoom", async (req, res, next) => {
    await functions.getRoomsByName(req, res, next);
  });

  app.post("/room", async (req, res, next) => {
    await functions.createRoom(req, res, next);
  });

  app.patch("/room", async (req, res, next) => {
    await functions.updateRoom(req, res, next);
  });

  app.patch("/room/message", async (req, res, next) => {
    await functions.updateMessageToRoom(req, res, next);
  });

  app.patch("/room/users/add", async (req, res, next) => {
    await functions.addUsersToRoom(req, res, next);
  });

  app.patch("/room/users/remove", async (req, res, next) => {
    await functions.removeUsersFromRoom(req, res, next);
  });

  app.delete("/room", async (req, res, next) => {
    await functions.deleteRoom(req, res, next);
  });
};

export default routesRoom;
