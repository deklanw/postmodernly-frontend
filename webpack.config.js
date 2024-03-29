const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  const dev = argv.mode !== 'production';

  return {
    entry: ['react-hot-loader/patch', './src/index.tsx'],
    resolve: {
      extensions: ['.jsx', '.js', '.tsx', '.ts'],
      alias: {
        'react-dom': '@hot-loader/react-dom'
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
        {
          test: /\.(png|jpg|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
          use: 'file-loader'
        }
      ]
    },
    plugins: [
      new Dotenv({ safe: true, path: dev ? './.env.dev' : './.env.prod' }),
      new CopyPlugin([{ from: './public/_redirects', to: '.' }]),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      }),
      new MiniCssExtractPlugin({ filename: 'styles.css' }),
      new BundleAnalyzerPlugin({ openAnalyzer: !dev })
    ],
    devtool: dev ? 'inline-source-map' : 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      publicPath: '/',
      historyApiFallback: true,
      port: 3000,
      compress: true,
      open: true,
      hot: true
    },
    output: {
      publicPath: '/'
    }
  };
};
