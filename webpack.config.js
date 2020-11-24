const path = require('path');
const pluginPath =path.join(__dirname, './PluginAndLoaders/CleanPlugin.js')
console.log(pluginPath, 'pluginPath');
const CleanPlugin = require(pluginPath);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniLoader = require('mini-css-extract-plugin');
const webpack = require('webpack');

/**
 * @type Configuration
 * @type {{output: {path: string, filename: string}, devtool: string, mode: string, entry: {app: string}, resolve: {extensions: [string, string]}, plugins: [*, CleanWebpackPlugin, HtmlWebpackPlugin], module: {rules: [{test: RegExp, loader: string}, {test: RegExp, use: [string, {loader: string, options: {importLoaders: number}}, string]}, {test: RegExp, use: [string]}]}}}
 */
const config = {
  entry: {
    app: './src/index.js',
  },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
  },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
      contentBase: 'public',
        port:9000,
        proxy: {
          '/api': {
              target: 'http://127.0.0.1:8888',
              changeOrigin: true
          }
        }
    },
    devtool: "eval-source-map",
    module: {
      rules: [
          {
              test: /\.jsx$/,
              exclude: /(node_modules|bower_components)/,
              use: [{
                  loader: 'babel-loader',
              }]
          },
          {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: [{
                  loader: 'babel-loader',
              }]
          },
          {
              test: /\.css$/,
              use: [
                  'style-loader',
                  { loader: 'css-loader', options: { importLoaders: 1 } },
              ]
          },
          {
            test: /\.less$/,
            use: [{
                loader: MiniLoader.loader // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "less-loader" // compiles Less to CSS
            }]
        },
          {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                  'file-loader'
              ]
          },
      ],
    },
    mode: 'development',
    plugins: [
        new webpack.LoaderOptionsPlugin({
            // test: /\.xxx$/, // may apply this only for some modules
            options: {
              targets: {ie: 8}
            }
          }),
        new MiniLoader(),
        // new CleanPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: '后台系统',
            template: "./src/index.html"
        })
    ]
};

module.exports = config;
