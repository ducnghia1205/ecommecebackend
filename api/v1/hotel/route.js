let controller = require('./controller');

module.exports = (route)=>{
  route.get('/hotel', controller.getList);
  route.get('/hotel/:id', controller.getDetail);
};
