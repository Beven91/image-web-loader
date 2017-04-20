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
  this.extensions = ['', '.jpg', '.jpeg', '.png', '.gif', '.bmp']
}

/**
 * 插件执行函数
 */
RequireImageXAssetPlugin.prototype.apply = function (compiler) {
  var thisContext = this
  compiler.plugin('compilation', function (compilation, params) {
    params.normalModuleFactory.plugin('before-resolve', function (value, next) {
      var abspath = thisContext.getRequest(value.request, value.context)
      if (abspath) {
        value.request = 'image!' + abspath
      }
      next(null, value)
    })
  })
}

/**
 * 获取需要处理的资源
 * @param request 请求的资源
 * @param context 引用模块的目录
 */
RequireImageXAssetPlugin.prototype.getRequest = function (request, context) {
  var element = (request || '').replace(/^-?!+/, '').replace(/!!+/g, '!').split('!')
  if (element.length == 2 && element[0] == 'image') {
    return this.find(element[1], context)
  }
}

/**
 * 根据imageAssets去查找对应的图片资源文件路径
 * @param name 请求的资源名称 
 * @param context 引用模块的目录
 */
RequireImageXAssetPlugin.prototype.find = function (name, context) {
  var imageAssets = this.isPath(name) ? context : this.imageAssets
  var extensions = this.extensions
  var abspath = null
  for (var i = 0,k = extensions.length;i < k;i++) {
    abspath = path.join(imageAssets, name + extensions[i])
    if (fs.existsSync(abspath)) {
      return abspath
    }
  }
}

/**
 * 判断模块路径是否为路径而不是名称
 * @param name 模块名称或者路径
 */
RequireImageXAssetPlugin.prototype.isPath = function (name) {
  if (path.isAbsolute(name) || name.split('/').length > 1) {
    return true
  }else {
    return false
  }
}

module.exports = RequireImageXAssetPlugin
