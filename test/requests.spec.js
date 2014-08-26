var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../'),
    request = require('request'),
    mock   = require('./mocks');



describe("Requests", function () {

  describe("raw", function () {
    it("with payload", function (done) {
      ninja.raw('GET', '/checklists', {foo: "bar"}, function (err, statuscode, body){
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        done();
      });

    });

    it("without payload",function (done) {
      ninja.raw('GET', '/checklists', function (err, statuscode, body){
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        done();
      });

    });
});

describe("Wrappers", function () {

    beforeEach(function(){
     sinon.stub(ninja, 'raw', mock.raw);
    })

    afterEach(function(){ ninja.raw.restore();});

    it("get", function (done) {
      ninja.get('/test', function (err, statuscode, body) {
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        expect(body).to.have.deep.property('method','GET');
        expect(body.payload).to.be.a('function');
        done();

      });
    });

    it("post", function (done) {
      ninja.post('/test', { foo: "bar" }, function (err, statuscode, body) {
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        expect(body).to.have.deep.property('method','POST');
        expect(body.payload).to.have.deep.property('foo','bar');
        done();
      });

    });

    it("put", function (done) {
      ninja.put('/test', { foo: "bar" }, function (err, statuscode, body) {
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        expect(body).to.have.deep.property('method','PUT');
        expect(body.payload).to.have.deep.property('foo','bar');
        done();
      });

    });

    it("patch",function (done) {
      ninja.patch('/test', { foo: "bar" }, function (err, statuscode, body) {
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        expect(body).to.have.deep.property('method','PATCH');
        expect(body.payload).to.have.deep.property('foo','bar');
        done();
      });

    });

    it("delete",function (done){
      ninja.delete('/test', function (err, statuscode, body) {
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        expect(body).to.have.deep.property('method','DELETE');
        done();
      });

    });
  });


  describe("Get or fail", function () {
    beforeEach(function () {
      sinon.stub(ninja, 'get', mock.get);
    });

    afterEach(function () {
      ninja.get.restore();
    });

    it("Get or fail: success", function (done) {
      ninja.getOrFail('/test', "message", function (err, data) {
        expect(err).to.not.be.ok;
        expect(data).to.equal('/test');
        done();
      });
    });

    it("Get or fail: fail on statusCode", function (done) {
      ninja.getOrFail('/failcode', "failed on status code", function (err, data) {
        expect(err).to.equal('failed on status code');
        done();
      });
    });

    it("Get or fail success", function (done) {
      ninja.getOrFail('/failerr', "failed on err", function (err, data) {
        expect(err).to.equal('failed on err');
        done();
      });
    });
  });


});