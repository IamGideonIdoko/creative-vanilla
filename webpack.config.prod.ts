import { join } from 'path';
import { merge } from 'webpack-merge';
import config from './webpack.config';
import type { Configuration } from 'webpack';

export default merge<Configuration>(config, {
  mode: 'production',
  output: {
    path: join(__dirname, 'build/client/public'),
  },
  plugins: [],
});
