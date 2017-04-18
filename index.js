'use strict'

var path = require('path')
var fs = require('fs')
var fromImageFile = require('image-size')
var loaderUtils = require('loader-utils')

module.exports = function (content) {
  if (this.cacheable) {
    this.cacheable()
  }
  var cleanPublicPath = content.replace('module.exports = ', '').replace(/;$/, '')
  var absoluteFile = this.resourcePath
  var query = loaderUtils.getOptions(this) || {}
  var assets = query.assets || process.cwd()
  var resolution = new Resolution(absoluteFile, cleanPublicPath).getResolution();
  return [
    'var resolution=' + JSON.stringify(resolution)+';',
    'var dpr = "@"+(global.devicePixelRatio || 1)+"x";',
    'var rect = resolution[dpr] || resolution["default"];',
    'module.exports ={"__packager_asset":true,"uri":rect.src,"width":rect.width,"height":rect.height,"deprecated":true}'
  ].join(' ')
}

function Resolution (abspath, cleanPublicPath) {
  this.abspath = abspath
  this.cleanPublicPath = cleanPublicPath
  this.ext = path.extname(abspath)
  this.name = abspath.split('.')[0]
  this.data = {}
}

Resolution.prototype.getResolution = function () {
  this.data['default'] = this.resolutionBy('', '@1x')
  this.resolutionBy('@1.5x')
  this.resolutionBy('@2x')
  this.resolutionBy('@3x')
  this.resolutionBy('@4x')
  return this.data
}

Resolution.prototype.resolutionBy = function (resolution, alias) {
  var ext = this.ext
  var name = this.name
  var abspath = name + resolution + ext
  if (fs.existsSync(abspath)) {
    var image = fromImageFile(abspath)
    return this.data[(resolution || alias)] = {
      width: image.width,
      height: image.height,
      src: this.cleanPublicPath.replace(ext, resolution + ext)
    }
  }
}
