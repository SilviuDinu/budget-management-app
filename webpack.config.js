const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require("path");

const htmlPlugin = new HtmlWebPackPlugin({
  template: './public/index.html',
  filename: './public/index.html',
});

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode: mode,
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif|pdf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [htmlPlugin],
};
