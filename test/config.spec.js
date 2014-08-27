var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../');

describe("Config", function () {
  it(".config()", function(){
    ninja.config({secret:'foo'});
    // using apiary here instead of a mock is BS. "I'll fix it later(tm)"
    var config = ninja.config({pubkey:'bar', host: 'https://checklistninja.apiary-mock.com'});
    expect(config).to.have.deep.property('secret','foo');
    expect(config).to.have.deep.property('pubkey','bar');
  });

  it(".sign()", function() {
    var config = ninja.config({secret: 'foo', pubkey:'bar', host: 'https://checklistninja.apiary-mock.com'}),
        signature = ninja.sign('GET', '/path/to?key=value', 'date');
    expect(signature).to.equal('d0df3b47811af73aa782102c975a3c451a80e32c');
  });

});