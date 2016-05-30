var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    test: [path.join(__dirname, 'webpack.test.bootstrap.js')]
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['app', 'node_modules']
  },

  node: {
    fs: 'empty'
  }
};
