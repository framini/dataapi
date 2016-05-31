const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./lib/parts');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  dist: path.join(__dirname, 'dist')
};

const common = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  }
};

const plugins = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'dataapi'
    })
  ]
}

let config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.dist,
          filename: '[name].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.babel(PATHS.app),
      parts.clean(PATHS.dist),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      )
    );
    break;
  case 'stats':
    config = merge(
      common,
      plugins
    );
    break;
  default:
    config = merge(
      common,
      plugins,
      {
        devtool: 'eval-source-map'
      },
      parts.babel(PATHS.app),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
