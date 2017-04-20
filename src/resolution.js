/**
 * 名称：用于生成不同设备的设备像素比例(Retina屏)来加载对应的图片的配置
 * 日期：2017-04-20
 */

var path = require('path')
var fs = require('fs')
var fromImageFile = require('image-size')

/**
 * 构造函数
 * @param abspath require引用的图片的原始路径
 * @param publicPath  图片引用的url路径
 * @param plugin  webpack loader执行上下文对象
 */
function Resolution (abspath, publicPath,plugin) {
  this.abspath = abspath
  this.publicPath = publicPath
  this.ext = path.extname(abspath)
  this.name = abspath.split('.')[0]
  this.plugin = plugin;
  this.data = {}
}


/**
 * 获取当前所支持的引用配置
 */
Resolution.prototype.getResolution = function () {
  this.resolutionBy('', '@1x')
  this.resolutionBy('@1.5x')
  this.resolutionBy('@2x')
  this.resolutionBy('@3x')
  this.resolutionBy('@4x')
  return this.data
}

/**
 * 根据传入的设备像素比来生成对应的图片信息
 */
Resolution.prototype.resolutionBy = function (resolution, alias) {
  var ext = this.ext
  var name = this.name
  var abspath = name + resolution + ext
  if (fs.existsSync(abspath)) {
    var image = fromImageFile(abspath)
    const x = fs.readFileSync(abspath)
    var xName = this.publicPath.replace(ext, resolution + ext);
    this.plugin.emitFile(xName, x)
    return this.data[(resolution || alias)] = {
      width: image.width,
      height: image.height,
      src: xName,
    }
  }
}

module.exports = Resolution;