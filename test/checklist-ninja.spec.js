var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../');

describe("Checklist Ninja", function () {

  it("Config", function(){
    ninja.config({secret:'foo'});
    // using apiary here instead of a mock is BS. "I'll fix it later(tm)"
    var config = ninja.config({pubkey:'bar', host: 'https://checklistninja.apiary-mock.com'});
    expect(config).to.have.deep.property('secret','foo');
    expect(config).to.have.deep.property('pubkey','bar');
  });

  it("sign", function() {
    var signature = ninja.sign('GET', '/path/to?key=value', 'date');
    expect(signature).to.equal('f48c5f1951e83de09a38af69df90c4081971422b');
  });

  describe("Requests", function () {

    it("raw",function (done) {
      ninja.raw('GET', '/checklists', {foo: "bar"}, function (err, statuscode, body){
        expect(err).to.not.be.ok;
        expect(statuscode).to.equal(200);
        done();
      });

    });

  describe("Wrappers", function () {

      beforeEach(function(){
        sinon.stub(ninja, 'raw', function(method, endpoint, payload, callback) {
          if (arguments.length === 3) {
            callback = payload;
          }
          callback(null, 200, {method: method, endpoint: endpoint, payload: payload });
        });
      });

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

  });

});
