const assert = require('assert');
const unitTest = require('./unittest');
const userTest = require('./user');

describe('Simple Math Test', () => {
  describe('--------- Unitest    ----------', () =>  {
    unitTest();
    // userTest();
  });
});
describe('Integration Test', () => {
  describe('--------- Test API    ----------', () =>  {
    userTest();
  });
});
