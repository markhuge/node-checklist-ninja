var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../'),
    mock   = require('./mocks');

describe("Account", function () {
  beforeEach(function () {
    sinon.stub(ninja, 'get', mock.get);
  });

  afterEach(function () {
    ninja.get.restore();
  });

  it("Get Account by ID", function (done) {
    ninja.getAccount(1234, function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.equal('/accounts/1234');
      done();
    });
  });

  it("Find Account by email", function (done) {
    ninja.findAccount('test@email.com', function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.equal('/accounts?email=test%40email.com');
      done();
    });
  });
});
