import config from '@/config/env-config';

export const isDevelopment = config.NEXT_PUBLIC_ENVIRONMENT === 'development';
