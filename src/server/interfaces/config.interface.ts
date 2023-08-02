interface EnvConfig {
  port: number;
  environment: string;
  isProd: boolean;
  isDev: boolean;
  isTest: boolean;
}

export type IServerConfig = {
  env: EnvConfig;
};
