let controller = require('./controller');

module.exports = (route)=>{
  route.get('/hotel', controller.getList);
  route.get('/hotel/:id', controller.getDetail);
  route.post('/hotel', controller.create);
  route.put('/hotel/:id', controller.update);
  route.delete('/hotel/:id', controller.delete);
};
