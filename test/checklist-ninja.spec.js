var expect = require('chai').expect,
    sinon  = require('sinon'),
    ninja  = require('../');

describe("Checklist Ninja", function () {

  it("Config", function(){
    ninja.config({secret:'foo'});
    var config = ninja.config({pubkey:'bar'});
    expect(config).to.have.deep.property('secret','foo');
    expect(config).to.have.deep.property('pubkey','bar');
  });

  it("sign", function() {
  	var signature = ninja.sign('GET', '/path/to?key=value', 'date')
    expect(signature).to.equal('f48c5f1951e83de09a38af69df90c4081971422b');
  })

});
