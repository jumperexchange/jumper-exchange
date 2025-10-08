import config from '@/config/env-config';
import { JumperBackend } from '@/types/jumper-backend';

const OPTIONAL_V1_SUFFIX = /\/v1\/?$/;

export const makeClient = (): JumperBackend<unknown> => {
  const baseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  const baseUrlWithoutV1 = baseUrl.replace(OPTIONAL_V1_SUFFIX, '');

  return new JumperBackend({
    baseUrl: baseUrlWithoutV1,
  });
};
