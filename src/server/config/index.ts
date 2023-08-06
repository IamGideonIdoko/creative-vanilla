import type { IServerConfig } from '@/s/interfaces';
import env from 'env-var';

const NODE_ENV = env.get('NODE_ENV').required().default('development').asString();
const PORT = env.get('PORT').required().default(5000).asPortNumber();

const serverConfig: IServerConfig = {
  env: {
    port: PORT,
    environment: NODE_ENV,
    isProd: NODE_ENV === 'production',
    isDev: NODE_ENV === 'development',
    isTest: NODE_ENV === 'test',
  },
};

export default serverConfig;
