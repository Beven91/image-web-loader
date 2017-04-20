/**
 * 名称：require(image!x)模式加载图片 插件(Webpack)
 * 日期：2017-04-20
 * 描述：
 */

var path = require('path')
var fs = require('fs')

/**
 * 插件构造函数
 * @param imageAssets 图片资源存放目录
 */
function RequireImageXAssetPlugin (imageAssets) {
  this.imageAssets = imageAssets
  this.extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
}

/**
 * 插件执行函数
 */
RequireImageXAssetPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation, params) {
    params.normalModuleFactory.plugin('before-resolve', function (value, next) {
      var request = value.request
      var element = request.replace(/^-?!+/, '').replace(/!!+/g, '!').split('!')
      if (element.length == 2 && element[0] == 'image') {
        value.request = this.find(element[1]) || request
      }
      next(null, value)
    })
  })
}

/**
 * 根据imageAssets去查找对应的图片资源文件路径
 * @param name 请求的资源名称 
 */
RequireImageXAssetPlugin.prototype.find = function (name) {
  var imageAssets = this.imageAssets
  var extensions = this.extensions
  var abspath = null
  for (var i = 0,k = extensions.length;i < k;i++) {
    abspath = path.join(imageAssets, name, extensions[i])
    if (fs.existsSync(abspath)) {
      return abspath
    }
  }
}

module.exports = RequireImageXAssetPlugin
