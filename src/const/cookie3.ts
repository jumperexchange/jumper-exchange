import type { UserOptions } from '@cookie3/analytics';

export const cookie3Config: UserOptions = {
  siteId: parseInt(process.env.NEXT_PUBLIC_COOKIE3_SITEID),
};
