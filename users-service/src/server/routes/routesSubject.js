const routesSubject = (app, functions) => {
  app.post("/subject", async (req, res, next) => {
    await functions.createSubject(req, res, next);
  });

  app.get("/subjects", async (req, res, next) => {
    await functions.getSubjects(req, res, next);
  });

  app.get("/subject/:name", async (req, res, next) => {
    await functions.getSubjectByName(req, res, next);
  });

  app.patch("/subject", async (req, res, next) => {
    await functions.updateSubject(req, res, next);
  });

  app.delete("/subject", async (req, res, next) => {
    await functions.deleteSubject(req, res, next);
  });
};

export default routesSubject;
