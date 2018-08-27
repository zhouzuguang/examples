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
   * optimization 是 webpack4改动最大的地方了
   * https://webpack.js.org/configuration/optimization/
   */
  optimization: {
    /*
     * manifest
     * https://webpack.js.org/concepts/manifest/
     */
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
     * https://webpack.js.org/plugins/mini-css-extract-plugin/
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
