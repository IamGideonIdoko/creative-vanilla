import { merge } from 'webpack-merge';
import config, { getClientWebpackPath } from './webpack.config';
import { type Configuration, HotModuleReplacementPlugin } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

export default merge<Configuration & DevServerConfiguration>(config, {
  mode: 'development',
  devtool: 'inline-source-map', // Helps when inspecting the HTML
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
  output: {
    path: getClientWebpackPath('public'),
    publicPath: '/',
  },
  plugins: [new HotModuleReplacementPlugin()],
});
