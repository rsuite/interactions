const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { NODE_ENV } = process.env;

const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: NODE_ENV === 'development',
});

const docsPath = NODE_ENV === 'development' ? './assets' : './';
const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(NODE_ENV),
  }),
  extractLess,
  new HtmlwebpackPlugin({
    title: 'Responsive Nav',
    filename: 'index.html',
    template: 'docs/index.html',
    inject: true,
    hash: true,
    path: docsPath,
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(
    new webpack.BannerPlugin({
      banner: `Last update: ${new Date().toString()}`,
    })
  );
}

/**
 * @type import('webpack').Configuration
 */
const common = {
  entry: path.resolve(__dirname, 'docs/index.js'),
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, ''),
    publicPath: '/',
  },
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'bundle.js',
    publicPath: './',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader?babelrc'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        loader: extractLess.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
              options: { javascriptEnabled: true },
            },
          ],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)($|\?)/,
        use: [
          {
            loader:
              'url-loader?limit=1&hash=sha512&digest=hex&size=16&name=resources/[hash].[ext]',
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      rsuite: path.resolve(__dirname, './node_modules/rsuite5'),
    },
  },
};

module.exports = () => {
  if (NODE_ENV === 'development') {
    return {
      ...common,
      entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://127.0.0.1:3100',
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, 'docs/index'),
      ],
      devtool: 'source-map',
    };
  }

  return { ...common, entry: [path.resolve(__dirname, 'docs/index')] };
};
