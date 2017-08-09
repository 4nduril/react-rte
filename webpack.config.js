/*eslint-env node */
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var moduleCSS = new ExtractTextPlugin('module.css');
var globalCSS = new ExtractTextPlugin('global.css');

var rules = [
  {
    test: /\.js$/,
    use: ['babel-loader'],
    exclude: /node_modules/,
  },
];

module.exports = [{
  entry: ['babel-polyfill', './src/RichTextEditor.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-rte.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
  module: {
    rules: rules.concat([
      {
        test: /\.css$/,
        exclude: /\.global\.css$/,
        use: moduleCSS.extract({
          fallback: {
            loader: 'style-loader',
            options: {sourceMap: true},
          },
          use: {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        }),
      },
      {
        test: /\.global\.css$/,
        use: globalCSS.extract({
          fallback: {
            loader: 'style-loader',
            options: {sourceMap: true},
          },
          use: 'raw-loader',
        }),
      },
    ]),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        warnings: false,
      },
    }),
    moduleCSS,
    globalCSS,
  ],
}, {
  entry: './src/demo.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'demo.js',
  },
  module: {
    rules: rules.concat([
      {
        test: /\.css$/,
        exclude: /\.global\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        }],
      },
      {
        test: /\.global\.css$/,
        use: ['style-loader', 'raw-loader'],
      },
    ]),
  },
}];
