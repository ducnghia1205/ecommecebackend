const express = require('express');
const middlewareResponse = require('../middleware/response');
const userController = require('../admin/user/controller');
const userRoute = require('../admin/user/route');
const hotelRouteApi = require('../api/v1/hotel/route');
const hotelRouteAdmin = require('../admin/hotel/route');


module.exports = (app) => {
  const appRoutes = express.Router();
  const apiRoutes = express.Router();
  const apiAuthRoutes = express.Router();

  apiRoutes.get('/health-check', (req, res, next) => {
    return res.status(200).json({ status: true });
  });

  middlewareResponse(app);

  //app route
  userRoute(appRoutes);

  // api route
  hotelRouteApi(apiRoutes);

  // admin route
  hotelRouteAdmin(apiAuthRoutes);

  app.use('/', appRoutes);
  app.use('/api/v1', apiRoutes);
  app.use('/admin', [userController.validateLogin], apiAuthRoutes);
};
