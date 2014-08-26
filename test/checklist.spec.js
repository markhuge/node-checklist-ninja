var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../'),
    mock   = require('./mocks');


describe("Checklists", function () {
  
  beforeEach(function () {
    sinon.stub(ninja, 'get', mock.get);
    sinon.stub(ninja, 'put', mock.put);
  });

  afterEach(function () {
    ninja.get.restore();
    ninja.put.restore();
  });

  it("Get Checklist", function (done) {
    ninja.getChecklist(1234, function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.equal('/checklists/1234');
      done();
    });

  });
  it("Get Checklists", function (done) {
    ninja.getChecklists(function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.equal('/checklists');
      done();
    });

  });
  it("Get Checklist Events", function (done) {
    ninja.getChecklistEvents(1234, function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.equal('/checklists/1234/events');
      done();
    });

  });
  it("Get Checklist Webhooks", function (done) {
    ninja.getChecklistWebhooks(1234, function (err, data) {
      expect(err).to.not.be.ok;
      expect(data).to.equal('/checklists/1234/webhooks');
      done();
    });
  });

  it("Create Checklist with title", function (done) {
    ninja.createChecklist("this is a new checklist", function (err, data){
      expect(err).to.not.be.ok;
      expect(data.payload).to.have.deep.property('title','this is a new checklist');
      expect(data).to.have.deep.property('endpoint','/checklists');
      done();
    });

  });


  it("Create Checklist with object", function (done) {
    ninja.createChecklist({title: "this is a new checklist", tags: "foo"}, function (err, data){
      expect(err).to.not.be.ok;
      expect(data.payload).to.have.deep.property('title','this is a new checklist');
      expect(data.payload).to.have.deep.property('tags','foo');
      expect(data).to.have.deep.property('endpoint','/checklists');
      done();
    });

  });

  it("Create Checklist fail", function (done) {
    ninja.createChecklist("failcode", function (err, data){
      expect(err).to.equal('Could not create checklist.');
      done();
    });

  });
});
