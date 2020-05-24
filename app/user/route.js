let controller = require('./controller');
let controllerHotel = require('../hotel/controller');

module.exports = (route)=>{
  route.post('/user/login', controller.login);
  route.post('/user/register', controller.register);
  route.get('/user/:id', controller.getUser);
  route.get('/hotel', controllerHotel.getList);
  route.get('/hotel/:id', controllerHotel.getDetail);
};
