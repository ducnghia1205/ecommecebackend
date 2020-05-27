const express = require('express');
const middlewareResponse = require('../middleware/response');
const userController = require('../app/user/controller');
const userRoute = require('../app/user/route');


module.exports = (app) => {
  const apiRoutes = express.Router();
  const apiAuthRoutes = express.Router();

  apiRoutes.get('/health-check', (req, res, next) => {
    return res.status(200).json({ status: true });
  });

  middlewareResponse(app);

  userRoute(apiRoutes);


  app.use('/', apiRoutes);
  app.use('/api', [userController.validateLogin], apiAuthRoutes);
};
