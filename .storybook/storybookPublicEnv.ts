import { getPublicEnvVars } from '../src/config/env-config.ts';

const JUMPER_STRAPI_URL = 'https://strapi.jumper.xyz';

export const getStorybookPublicEnv = () => {
  const env = getPublicEnvVars();

  return {
    ...env,
    NEXT_PUBLIC_STRAPI_URL: env.NEXT_PUBLIC_STRAPI_URL || JUMPER_STRAPI_URL,
    NEXT_PUBLIC_ENVIRONMENT: env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  };
};

export const toViteEnvDefine = (env: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
      `process.env.${key}`,
      JSON.stringify(value),
    ]),
  );
