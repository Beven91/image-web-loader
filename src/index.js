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
  content = handleContent(content);
  var context = this;
  var callback = this.async()
  var publicPath = content.replace(/;$/, '')
  var absoluteFile = this.resourcePath;
  new Resolution(absoluteFile, publicPath, this).getResolution().then(function (resolution) {
    callback(null, createModule(context, resolution,publicPath));
  }).catch(callback)
}

module.exports.sync = function (content) {
  if (this.cacheable) {
    this.cacheable()
  }
  content = handleContent(content);
  var publicPath = content.replace(/;$/, '')
  var absoluteFile = this.resourcePath;
  var resolution = new Resolution(absoluteFile, publicPath, this).getResolutionSync();
  return createModule(this, resolution,publicPath);
}

function handleContent(content) {
  if (content.indexOf('module.exports') > -1) {
    var md = {}
    new Function('module,__webpack_public_path__', content)(md, '')
    content = md.exports
  }
  return content;
}

function createModule(context, resolution,publicPath) {
  var compiler = context._compiler;
  var query = loaderUtils.getOptions(context) || {}
  var assets = query.assets || process.cwd()
  var assetsPath = (context.options || compiler.options).output.publicPath
  var cdnUriName = query.contextName || '""';
  var onlyWeb = query.onlyWeb;
  var exportCode = 'module.exports ={"__packager_asset":true,"uri":baseUri+"' + assetsPath + '"+rect.src,"width":rect.width,"height":rect.height,"deprecated":true}';
  var onlyWebCode = 'module.exports =baseUri+"' + assetsPath + '"+rect.src;';
  return [
    'var resolution=' + JSON.stringify(resolution) + ';',
    'var dpr = "@"+(global.devicePixelRatio || 1)+"x";',
    'var rect = resolution[dpr] || resolution["@1x"];',
    'var baseUri = ' + cdnUriName + ';',
    onlyWeb ? onlyWebCode : exportCode
  ].join(' ')
}

module.exports.RequireImageXAssetPlugin = RequireImageXAssetPlugin
