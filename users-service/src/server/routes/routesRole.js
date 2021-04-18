const routesRole = (app, functions) => {
    app.post("/role", async (req, res, next) => {
      await functions.createRole(req, res, next);
    });
  
    app.get("/roles", async (req, res, next) => {
      await functions.getRoles(req, res, next);
    });
  };
  
  export default routesRole;
  