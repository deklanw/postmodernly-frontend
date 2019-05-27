const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  const dev = argv.mode !== 'production';

  return {
    entry: {
      app: './src/index.tsx'
    },
    resolve: {
      extensions: ['.jsx', '.js', '.tsx', '.ts'],
      alias: {
        'core-js': 'core-js3'
      }
    },
    output: {
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            { loader: 'babel-loader' },
            {
              loader: 'linaria/loader',
              options: {
                sourceMap: dev
              }
            }
          ],
          // exclude: /node_modules/
          // exclude: /node_modules\/(?!(module1|module2)\/).*/
          exclude: /node_modules(?!(\/|\\)formik)/
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: dev
              }
            },
            { loader: 'css-loader', options: { sourceMap: dev } }
          ]
        },
        { test: /\.(a?png|svg)$/, use: 'url-loader?limit=10000' },
        {
          test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
          use: 'file-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new MiniCssExtractPlugin({ filename: 'styles.css' }),
      new BundleAnalyzerPlugin({ openAnalyzer: !dev })
    ],
    devtool: dev ? 'inline-source-map' : 'source-map',
    devServer: {
      contentBase: './dist',
      port: 3000,
      compress: true,
      open: true
    }
  };
};
