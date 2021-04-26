const routesMessage = (app, functions) => {
  app.post("/message", async (req, res, next) => {
    await functions.createMessage(req, res, next);
  });

  app.get("/messages/:room", async (req, res, next) => {
    await functions.getMessgesForARoom(req, res, next);
  });

  app.get("/messages", async (req, res, next) => {
    await functions.getAllMessages(req, res, next);
  });

  app.get("/messages/id/:messageIds", async (req, res, next) => {
    await functions.getMessagesByIdOneTime(req, res, next);
  });

  app.get("/message/:id", async (req, res, next) => {
    await functions.getMessageById(req, res, next);
  });

  app.patch("/message", async (req, res, next) => {
    await functions.updateMessage(req, res, next);
  });

  app.patch("/message/file", async (req, res, next) => {
    await functions.updateFileToMessage(req, res, next);
  });

  app.delete("/message", async (req, res, next) => {
    await functions.deleteMessage(req, res, next);
  });
};

export default routesMessage;
