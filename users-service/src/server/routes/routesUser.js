const routesUser = (app, functions) => {
  app.post("/session", async (req, res, next) => {
    await functions.createSession(req, res, next);
  });

  app.delete("/session/:id", async (req, res, next) => {
    await functions.deleteSession(req, res, next);
  });

  app.get("/session/:id", async (req, res, next) => {
    await functions.getUserSession(req, res, next);
  });

  app.post("/login", async (req, res, next) => {
    await functions.login(req, res, next);
  });

  app.post("/logout", async (req, res, next) => {
    await functions.logout(req, res, next);
  });

  app.post("/user", async (req, res, next) => {
    await functions.createUser(req, res, next);
  });

  app.get("/users", async (req, res, next) => {
    await functions.getAllUser(req, res, next);
  });

  app.get("/user/:email", async (req, res, next) => {
    await functions.getUser(req, res, next);
  });

  app.get("/user/id/:id", async (req, res, next) => {
    await functions.getUserById(req, res, next);
  });

  app.patch("/user/room/delete", async (req, res, next) => {
    await functions.deleteRoomFromUser(req, res, next);
  });

  app.patch("/user", async (req, res, next) => {
    await functions.updateUser(req, res, next);
  });

  app.patch("/user/class", async (req, res, next) => {
    await functions.updateUserToClass(req, res, next);
  });

  app.patch("/user/classes", async (req, res, next) => {
    await functions.updateUserToClasses(req, res, next);
  });

  app.patch("/user/message", async (req, res, next) => {
    await functions.updateMessageToUser(req, res, next);
  });

  app.patch("/user/room", async (req, res, next) => {
    await functions.updateRoomToUser(req, res, next);
  });

  app.patch("/users/room", async (req, res, next) => {
    await functions.updateUsersToRoom(req, res, next);
  });

  app.patch("/users/roomName", async (req, res, next) => {
    await functions.updateRoomInUsers(req, res, next);
  });

  app.patch("/users/room/remove", async (req, res, next) => {
    await functions.removeRoomFromUsers(req, res, next);
  });

  app.patch("/user/message/remove", async (req, res, next) => {
    await functions.removeMessageFromUser(req, res, next);
  });

  app.delete("/user", async (req, res, next) => {
    await functions.deleteUser(req, res, next);
  }); // new
};

export default routesUser;
