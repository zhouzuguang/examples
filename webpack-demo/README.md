### 说明
参考`vue-cli` `webpack`模板, 用 `webpack4.x`配置了`vue`项目
### 开始
与`browserify`不同,`webpack`是配置式的,所以我会先把配置文件写上,并在文件里面写好注释
#### 项目结构

```bash
|-- webpack-demo
|   |-- build
|   |   |-- webpack.base.conf.js
|   |   |-- webpack.dev.conf.js
|   |   |-- webpack.prod.conf.js
|   |-- node_modules
|   |-- dist
|   |-- src
|       |-- components
|           |-- Hello.vue
|       |-- main.js
|   -- babelrc
|   -- index.html
|   -- package.json
|   -- README.md
```
package.json
```bash
/* webpack webpack-cli 我装在全局了,没有安装的请自行安装  */
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.prod.conf.js",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.dev.conf.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "vue": "^2.5.17"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "babel-runtime": "^6.26.0",
    "cross-env": "^5.2.0",
    "css-loader": "^1.0.0",
    "friendly-errors-webpack-plugin": "^1.7.0",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.4.2",
    "optimize-css-assets-webpack-plugin": "^5.0.0",
    "style-loader": "^0.22.1",
    "uglifyjs-webpack-plugin": "^1.3.0",
    "vue-loader": "^15.4.1",
    "vue-template-compiler": "^2.5.17",
    "webpack-merge": "^4.1.4"
  }
}

```
#### 公共配置
```javascript
  /* build/webpack.base.conf.js */
  'use strict'
  const path = require('path')
  /*
   * 引入vue-loader plugin
   * 好像是新版本的vue-loader 需要这样处理
   * https://vue-loader.vuejs.org/guide/#vue-cli
   */
  const VueLoaderPlugin = require('vue-loader/lib/plugin')
  /*
   * MinnCssExtractPlugin 可将 css 分离, 主要用于生产环境css的分离
   * 取代 extract-text-webpack-plugin,
   * 如果 webpack4 使用 extract-text-webpack-plugin的话,请使用
   * extract-text-webpack-plugin@next,据说是作者在忙,未及时更新,社区临时使用这个
   * https://webpack.js.org/plugins/mini-css-extract-plugin/
   */
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const dev = process.env.NODE_ENV !== 'production'
  module.exports = {
    /* 设置入口根目录 */
    context: path.resolve(__dirname, '..'),
    entry: {
      app: './src/main.js'
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].js'
    },
    /*
     * 解析 vue
     * import Vur from 'vue' 实际上是
     * import Vue from 'vue/dist/vue.esm.js'
    */
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [
        /*  处理.vue文件  */
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          include: [path.resolve(__dirname, '../src')]
        },
        /* babel 转码 */
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [path.resolve(__dirname, '../src')]
        },
        /* 处理 css */
        {
          test: /\.css$/,
          loaders: [
            dev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ],
          include: [path.resolve(__dirname, '../src')]
        }
      ]
    },
    plugins: [
      /* 好像是新版vue-loader 需要引入这个 */
      new VueLoaderPlugin()
    ]
  }
```

#### 开发环境
```javascript
  /* build/webpack.dev.conf.js */
  'use strict'
  const webpack = require('webpack')
  const BaseWebpackConf = require('./webpack.base.conf')
  const path = require('path')
  const merge = require('webpack-merge')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

  module.exports = merge(BaseWebpackConf, {
    /*
     * mode webpack4新内容
     * development：开启 NamedChunksPlugin 和 NamedModulesPlugin
     * production:FlagDependencyUsagePlugin,
     *            FlagIncludedChunksPlugin,
     *            ModuleConcatenationPlugin 作用域提升
     *            NoEmitOnErrorsPlugin, 不报错
     *            OccurrenceOrderPlugin,
     *            SideEffectsFlagPlugin
     *            UglifyJsPlugin. js压缩
     * 默认为 production
     */
    mode: 'development',
    /*
     *  按照什么方式生成代码
     *  https://webpack.js.org/configuration/devtool/
     */
    devtool: 'cheap-module-eval-source-map',
    /*
     * 配置本地服务器
     * https://webpack.js.org/configuration/dev-server/
     */
    devServer: {
      quiet: true,
      clientLogLevel: 'warning',
      historyApiFallback: {
        rewrites: [
          {
            from: /.*/,
            to: path.resolve(__dirname, '../dist/index.html')
          }
        ]
      },
      contentBase: path.resolve(__dirname, '../dist'),
      inline: true,
      progress: true,
      hot: true,
      compress: true,
      open: true,
      proxy: {}
    },
    plugins: [
      /* 热更新
       * https://webpack.js.org/guides/hot-module-replacement/
      */
      new webpack.HotModuleReplacementPlugin(),
      /*
       * html 模板
       * 把生成的资源插入到模板中,生成新的页面,避免手动管理资源
       * https://webpack.docschina.org/plugins/html-webpack-plugin/
       */
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '../index.html')
      }),
      /*
       * 错误友好提示
       * 如果代码出错了,控制台会显示错误,排版挺好看的
       * http://npm.taobao.org/package/friendly-errors-webpack-plugin
       */
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [
            'your application is running here http://localhost:8080 '
          ]
        }
      })
    ]
  })
```

#### 生产环境
```javascript
'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const BaseWebpackConf = require('./webpack.base.conf')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = merge(BaseWebpackConf, {
  mode: 'production',
  devtool: '#source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  /*
   * optimization 是 webpack4改动最大的地方了,
   * https://webpack.js.org/configuration/optimization/
   */
  optimization: {

    runtimeChunk: {
      name: 'manifest'
    },
    /*
     * minizer: 默认开启 new UglifyJsPlugin()
     * 对 css 压缩的话, 需要重写 minizer
     */
    minimizer: [
      /*
       * js 压缩
       * https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
       */
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      /*
       * css 压缩
       * https://www.npmjs.com/package/optimize-css-assets-webpack-plugin
       */
      new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: {
      /*
       * 分离第三方资源
       */
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          priority: -10,
          reuseExistingChunk: false,
          test: /[\\/]node_modules[\\/]/
        }
      }
    }
  },
  plugins: [
    /*
     * 将css分离出来
     */
    new MiniCssExtractPlugin({
      filename: 'static/css/app.[name].css',
      chunkFilename: 'static/css/app.[contenthash].css'
    }),
    /*
     * html 模板
     */
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    /*
     * 之前不是很理解这个插件的用法，后来看了这篇文章
     * 主要是讲多次构建代码的时候 如何做处理好缓存
     *  https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
     */
    new webpack.HashedModuleIdsPlugin()
  ]
})

```
#### [babel 配置](https://github.com/zhouzuguang/examples/tree/master/babel-demo)
```javascript
/* .babelrc */
{
  "presets":[
    [
      "env",{
          "modules":false,
      }
    ]
  ],
  "plugins":["transform-runtime"]
}

```
### 心得
`webpack4.0`配置开发环境还是挺简单的,引入一些`loader`,再引入`html-webpack-plugin`,`friendly-errors-webpack-plugin`,
配置一下生产服务器,启用热更新,基本就可以了。配置生产环境就相对麻烦一点,代码要分离提取压缩,还要考虑分块打包
,异步加载,再次构建时缓存处理等问题。相比`browserify`,`webpack`上手确实难啊,官网有些资料也更新慢了，断断续续看了几天,查了好多资料,还不是特别理解,
还需要继续琢磨吧。

### 文档
> - [webpack](https://webpack.js.org)
> - [Predictable long term caching with Webpack](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)
> - [webpack4.0实战那些事儿](https://segmentfault.com/a/1190000014112145?utm_source=channel-newest)
> - [webpack4.x配置指南](https://segmentfault.com/a/1190000015592264)
