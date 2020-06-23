let controller = require('./controller');

module.exports = (route)=>{
  route.get('/booking', controller.getList);
  route.get('/booking/:id', controller.getDetail);
  route.post('/booking', controller.create);
  route.put('/booking/:id', controller.update);
  route.delete('/booking/:id', controller.delete);
};
