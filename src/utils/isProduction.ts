import config from '@/config/env-config';

export const isProduction = config.NEXT_PUBLIC_ENVIRONMENT === 'production';
