var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../'),
    mock   = require('./mocks');


describe("Groups", function () {
  beforeEach(function () {
    sinon.stub(ninja, 'put', mock.put);
  });

  afterEach(function () {
    ninja.put.restore();
  });

  it("Create Group", function (done) {
    ninja.createGroup(1234, "this is a group label", "parent?", 1, function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.have.deep.property('endpoint','/checklists/1234/groups');
      expect(data.payload).to.have.deep.property('label', 'this is a group label');
      expect(data.payload).to.have.deep.property('position', 1);
      done();
    });
  });

  it("Create Group fails on status code", function (done) {
    ninja.createGroup(1234, "failcode", "parent?", 1, function (err, data) {
      expect(err).to.equal('Could not create checklist group.');
      done();
    });
  });


});