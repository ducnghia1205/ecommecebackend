const expect = require('chai').expect;

module.exports = function () {
  it('Unit Test should return 2', (done) => {
    expect(1+1).to.equal(2);
    done()
  });
  it('Unit Testshould return 9', (done) => {
    expect(3*3).to.equal(9);
    done()
  });
}
