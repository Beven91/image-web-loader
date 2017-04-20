var assert = require('chai').assert
var loader = require('../index.js')
var path = require('path')

describe('index.js', function () {

  // --------------index.loader--------------------->
  it('loader', function () {
    var source = 'module.exports =\'../assets/back-icon.png\'';
    var obj = {
      cacheable: function () {},
      emitFile:function(){},
      resourcePath: path.join(__dirname, '../assets/back-icon.png')
    }
    var module = loader.apply(obj, [source])
    var fun = new Function('module,global,__webpack_public_path__', module)
     
    var getSource = function (p) {
      var obj = {devicePixelRatio: p}
      var module1 = {}
      fun(module1, obj,'')
      return module1.exports
    }
    assert.equal(true,getSource(1).uri=="../assets/back-icon.png")
    assert.equal(true,getSource(1.5).uri=="../assets/back-icon@1.5x.png")
    assert.equal(true,getSource(2).uri=="../assets/back-icon@2x.png")
    assert.equal(true,getSource(3).uri=="../assets/back-icon@3x.png")
    assert.equal(true,getSource(4).uri=="../assets/back-icon@4x.png")
    assert.equal(true,getSource(null).uri=="../assets/back-icon.png")
  })
})