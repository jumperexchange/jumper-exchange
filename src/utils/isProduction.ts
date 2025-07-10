import config from '@/config/env-config';

export const isProduction = config.ENV_NAME === 'prod';
