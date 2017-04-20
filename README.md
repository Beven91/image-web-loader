## image-web-loader

### 一、简介

    用于react-native for web的webpack 图片加载器

    支持web端根据devicePixelRatio 来加载@1x @1.5x @2x @3x @4x

    例如: require('image/a.jpg'); --> images/a@1x.jpg  .....

    或者  require('image!x')


### 二、安装

    npm install image-web-loader --save-dev
    
     
### 三、使用

Webpack config example:

    var RequireImageXAssetPlugin  =require('image-web-loader').RequireImageXAssetPlugin;

    module.exports = {
      plugins:[
        ....
        new RequireImageXAssetPlugin(path.resolve('assets/images'))
      ]
      module: {
        loaders: [
          {
            test: /\.(gif|jpeg|jpg|png|svg)$/,
            loader: 'image-web-loader!file-loader'
          }
        ]
      }
    }


Code example:

   require('./image/icon.png')  ---> {uri:'xxx/hello(@1x|@1.5x|@2x|@3x|@4x).png',width:xx,height:xx}

   require('image!hello) --->  {uri:'xxx/assets/images/hello.(png|gif|jpg|ico|bmp)',width:xx,height:xx}

### 四、开源许可
基于 [MIT License](http://zh.wikipedia.org/wiki/MIT_License) 开源，使用代码只需说明来源，或者引用 [license.txt](https://github.com/sofish/typo.css/blob/master/license.txt) 即可。