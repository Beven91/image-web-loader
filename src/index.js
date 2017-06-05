/**
 * 名称  webpack image-web-loader
 * 日期：2017-04-20
 * 描述：使react支持react-native方式加载图片
 *      例如：require('../images/a.png')  --->  {uri:'xxx/images/a.png',width:xx,height:xxx}
 *      同时提供[RequireImageXAssetPlugin] 来支持require(image!x) 加载指定目录下的图片
 */
'use strict'

var loaderUtils = require('loader-utils')
var Resolution = require('./resolution.js')
var RequireImageXAssetPlugin = require('./plugin.js')

module.exports = function (content) {
  if (this.cacheable) {
    this.cacheable()
  }
  if (content.indexOf('module.exports') > -1) {
    var md = {}
    new Function('module,__webpack_public_path__', content)(md, '')
    content = md.exports
  }
  var callback = this.async()
  var publicPath = content.replace(/;$/, '')
  var absoluteFile = this.resourcePath
  var query = loaderUtils.getOptions(this) || {}
  var assets = query.assets || process.cwd()
  var assetsPath = this.options.output.publicPath
  var cdnUriName = query.contextName || '\'\'';

  new Resolution(absoluteFile, publicPath, this).getResolution().then(function (resolution) {
    callback(null, [
      'var resolution=' + JSON.stringify(resolution) + ';',
      'var dpr = "@"+(global.devicePixelRatio || 1)+"x";',
      'var rect = resolution[dpr] || resolution["@1x"];',
      'var baseUri = '+cdnUriName+';',
      'module.exports ={"__packager_asset":true,"uri":baseUri+"' + assetsPath + '"+rect.src,"width":rect.width,"height":rect.height,"deprecated":true}'
    ].join(' '))
  }).catch(callback)
}

module.exports.RequireImageXAssetPlugin = RequireImageXAssetPlugin
