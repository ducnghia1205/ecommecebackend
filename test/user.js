const chai = require('chai');
const assert = require('assert');
const UserModel = require('../app/user/model');
const chaiHttp = require('chai-http');
const server = require('../bin');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

module.exports = function () {
  it('/POST  /user/register with User', (done) => {
    let userFake = {
      name: 'nghia',
      userName: 'duclut1',
      password: 'TEST',
      email: 'ahihi1@gmail.com',
    };
    chai.request(server)
      .post('/user/register')
      .send(userFake)
      .end((err, res) => {
        console.log(res.body);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.should.have.property('error').eql(false);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('name').eql(userFake.name);
        res.body.data.should.have.property('userName').eql(userFake.userName);
        res.body.data.should.have.property('email').eql(userFake.email);
        done();
      });
  });
  it('Unit Testshould return 9', (done) => {
    expect(3*3).to.equal(9);
    done()
  });
};
