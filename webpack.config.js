<<<<<<< HEAD
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
=======
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const srcDir = path.resolve(__dirname, "client");
const distDir = path.resolve(__dirname, "dist");
>>>>>>> 374681ca94ba210f4c4945d67600608ec361e6b4

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: {
    app: path.resolve(__dirname, './client/index.jsx'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.gif$/i,
<<<<<<< HEAD
        use: [{
          loader: 'file-loader',
        }]
      }
=======
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
>>>>>>> 374681ca94ba210f4c4945d67600608ec361e6b4
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './client/index.html'),
      inject: 'body',
    }),
    new NodePolyfillPlugin(),
  ],
  resolve: {
    fallback: {
<<<<<<< HEAD
      'fs': false,
    },
    extensions: ['.js', '.jsx', '.gif'],
    
  },
  watch: true,
=======
      fs: false,
    },
  },
  // target: 'node',
>>>>>>> 374681ca94ba210f4c4945d67600608ec361e6b4
};
