const routesRootRoom = (app, functions) => {
  app.get("/rootRooms", async (req, res, next) => {
    await functions.getRootRooms(req, res, next);
  });

  app.get("/rootRoom/:name", async (req, res, next) => {
    await functions.getRootRoomByName(req, res, next);
  });

  app.post("/rootRoom", async (req, res, next) => {
    await functions.createRootRoom(req, res, next);
  });

  app.patch("/rootRoom/class", async (req, res, next) => {
    await functions.updateClassInRootRoom(req, res, next);
  });

  app.patch("/rootRoom", async (req, res, next) => {
    await functions.updateRootRoom(req, res, next);
  });

  app.delete("/rootRoom", async (req, res, next) => {
    await functions.deleteRootRoom(req, res, next);
  });
};

export default routesRootRoom;
