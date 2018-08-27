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
