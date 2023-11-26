
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const srcDir = path.resolve(__dirname, "client");
const distDir = path.resolve(__dirname, "dist");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin



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
        use: [{
          loader: 'file-loader',
        }]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './client/index.html'),
      inject: 'body',
    }),
    new NodePolyfillPlugin(),

    new BundleAnalyzerPlugin()


  ],
  resolve: {
    fallback: {
      'fs': false,
    },
    extensions: ['.js', '.jsx', '.gif'],
    
  },
  watch: true,
};
