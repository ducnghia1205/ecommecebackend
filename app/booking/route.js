let controller = require('./controller');

module.exports = (route)=>{
  route.post('/book', controller.create);
  route.get('/book', controller.getList);
  route.get('/book/:id', controller.getDetail);
};
