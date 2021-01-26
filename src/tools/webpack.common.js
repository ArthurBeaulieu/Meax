const path = require('path');
const webpack = require('webpack');
const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  entry: ['./src/js/Meax.js'],
  module: {
    rules: [
      loaders.JSLoader,
      loaders.CSSLoader
    ]
  },
  output: {
    filename: 'Meax.bundle.js',
    path: path.resolve(__dirname, '../../assets/dist'),
    library: 'Meax', // We set a library name to bundle the export default of the class
    libraryTarget: 'window', // Make it globally available
    libraryExport: 'default' // Make Kom.default become Kom
  },
  plugins: [
    new webpack.ProgressPlugin(),
    plugins.CleanWebpackPlugin,
    //plugins.ESLintPlugin,
    //plugins.StyleLintPlugin,
    plugins.MiniCssExtractPlugin
  ]
};
