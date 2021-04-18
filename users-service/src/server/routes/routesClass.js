const routesClass = (app, functions) => {
  app.post("/class", async (req, res, next) => {
    await functions.createClass(req, res, next);
  });

  app.get("/classes", async (req, res, next) => {
    await functions.getClasses(req, res, next);
  });

  app.get("/class/:name", async (req, res, next) => {
    await functions.getClassByName(req, res, next);
  });

  app.patch("/class/rootRoom", async (req, res, next) => {
    await functions.updateRootRoomToClass(req, res, next);
  });

  app.patch("/class", async (req, res, next) => {
    await functions.updateClass(req, res, next);
  });

  app.patch("/class/rootRoom/remove", async (req, res, next) => {
    await functions.removeRootRoomFromClass(req, res, next);
  });

  app.patch("/class/users/remove", async (req, res, next) => {
    await functions.removeUsersFromClass(req, res, next);
  });

  app.delete("/class", async (req, res, next) => {
    await functions.deleteClass(req, res, next);
  });
};

export default routesClass;
