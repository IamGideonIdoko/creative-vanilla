import { join, dirname } from 'path';
import { merge } from 'webpack-merge';
import config, { filename } from './webpack.config';
import type { Configuration } from 'webpack';

export default merge<Configuration>(config, {
  mode: 'production',
  output: {
    path: join(dirname(filename), 'public')
  },
  plugins: []
});
