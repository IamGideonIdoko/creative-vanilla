import { join } from 'path';
import webpack, { type Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const getClientWebpackPath = (path: string) => join(__dirname, `src/client/${path}`);

export default {
  entry: [getClientWebpackPath('index.ts'), getClientWebpackPath('styles/index.scss')],
  resolve: {
    // configure where webpack looks for modules
    modules: ['node_modules'],
    alias: {
      '@/c': getClientWebpackPath(''),
    },
  },
  plugins: [
    // Run TypeScript type checker on a separate process.
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    // some plugins are built into webpack
    new webpack.DefinePlugin({
      // allows for creation of global constants
      __DEV__: process.env.NODE_ENV === 'development',
    }),
    new webpack.ProvidePlugin({}), // use modules without having to use import/require
    new CopyWebpackPlugin({
      patterns: [
        {
          from: getClientWebpackPath('shared'), // copy from shared to the public dir
          to: '',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
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
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'asset/source',
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ],
  },
  watchOptions: {
    // for some systems, watching many files can result in a lot of CPU or memory usage
    // https://webpack.js.org/configuration/watch/#watchoptionsignored
    // don't use this pattern, if you want to use this if it's monorepo with linked packages
    ignored: /node_modules/,
  },
} satisfies Configuration;
