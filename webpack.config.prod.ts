import { join } from 'path';
import { merge } from 'webpack-merge';
import config, { getClientWebpackPath } from './webpack.config';
import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default merge<Configuration>(config, {
  mode: 'production',
  output: {
    path: join(__dirname, 'build/client/public'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: getClientWebpackPath('shared'), // copy from shared to the public dir
          to: '',
        },
        {
          from: getClientWebpackPath('views'), // copy from shared to the public dir
          to: '../views',
        },
      ],
    }),
  ],
});
