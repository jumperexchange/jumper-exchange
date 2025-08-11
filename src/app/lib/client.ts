import config from '@/config/env-config';
import { JumperBackend } from '@/types/jumper-backend';

export const makeClient = (): JumperBackend<unknown> => {
  return new JumperBackend({
    baseUrl: config.NEXT_PUBLIC_JUMPER_API,
  });
};
