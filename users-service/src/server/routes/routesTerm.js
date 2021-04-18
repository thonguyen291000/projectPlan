const routesTerm = (app, functions) => {
  app.post("/term", async (req, res, next) => {
    await functions.createTerm(req, res, next);
  });

  app.get("/terms", async (req, res, next) => {
    await functions.getTerms(req, res, next);
  });

  app.get("/term/:name", async (req, res, next) => {
    await functions.getTermByName(req, res, next);
  });

  app.patch("/term", async (req, res, next) => {
    await functions.updateTerm(req, res, next);
  });

  app.delete("/term", async (req, res, next) => {
    await functions.deleteTerm(req, res, next);
  })
};

export default routesTerm;
