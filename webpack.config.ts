import { join, dirname } from 'path';
import webpack, { type Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';

export const filename = fileURLToPath(import.meta.url);

export const getClientWebpackPath = (path: string) => join(dirname(filename), `src/client/${path}`);

export default {
  entry: [getClientWebpackPath('index.js'), getClientWebpackPath('styles/index.scss')],
  resolve: {
    // configure where webpack looks for modules
    modules: ['node_modules'],
    alias: {
      '@/client': getClientWebpackPath(''),
    },
  },
  plugins: [
    // some plugins are built into webpack
    new webpack.DefinePlugin({
      // allows for creation of global constants
      __DEV__: process.env.NODE_ENV === 'dev',
    }),
    new webpack.ProvidePlugin({}), // use modules without having to use import/require
    new CopyWebpackPlugin({
      patterns: [
        {
          from: getClientWebpackPath('shared'), // copy from shared to the public dir
          to: ''
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // TODO: Add image minifier plugin/loader
    // package: image-minimizer-webpack-plugin
    new CleanWebpackPlugin(), // remove or clean build folder(s)
    new ESLintPlugin({}),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'asset/source',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
} satisfies Configuration;
