var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../'),
    mock   = require('./mocks');


describe("Items", function () {
  beforeEach(function () {
    sinon.stub(ninja, 'put', mock.put);
  });

  afterEach(function () {
    ninja.put.restore();
  });

  it("Create Item", function (done) {
    ninja.createItem(1234, "this is a new item", "parent?", 1, function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.have.deep.property('endpoint','/checklists/1234/items');
      expect(data.payload).to.have.deep.property('display_text', 'this is a new item');
      expect(data.payload).to.have.deep.property('position', 1);
      done();
    });
  });

  it("Create Item Fail on statusCode", function (done) {
    ninja.createItem(1234, "failcode", "parent?", 1, function (err, data) {
      expect(err).to.equal('Could not create checklist item.');
      done();
    });
  });


});