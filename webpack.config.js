const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const srcDir = path.resolve(__dirname, "client");
const distDir = path.resolve(__dirname, "dist");

module.exports = {
  mode: "development",
  watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
  devtool: "inline-source-map",
  stats: {
    excludeModules: /node_modules/,
  },
  entry: {
    app: path.resolve(srcDir, "index.jsx"),
  },
  output: {
    path: distDir,
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.gif$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(srcDir, "index.html"),
      inject: "body",
    }),
    new NodePolyfillPlugin(),
  ],
  resolve: {
    fallback: {
      fs: false,
    },
  },
  // target: 'node',
};
