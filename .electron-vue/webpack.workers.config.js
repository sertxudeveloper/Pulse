'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const {dependencies} = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let workersConfig = {
  entry: {
    workers: path.join(__dirname, '../src/main/workers/songProcess.js')
  },
  externals: [
    ...Object.keys(dependencies || {}),
    'child_process'
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron/workers')
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // new CopyWebpackPlugin([{from: path.join(__dirname, '../src/main'), to: path.join(__dirname, '../dist/electron')}])
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}

/**
 * Adjust workersConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  workersConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust workersConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  workersConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = workersConfig
