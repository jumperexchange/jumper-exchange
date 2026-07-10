import config from '@/config/env-config';
import { JumperLimitOrder } from '@/types/jumper-limit-order';

export const makeLimitOrderClient = (): JumperLimitOrder<unknown> => {
  return new JumperLimitOrder({
    baseUrl: config.NEXT_PUBLIC_LIMIT_ORDER_BACKEND_URL,
  });
};
