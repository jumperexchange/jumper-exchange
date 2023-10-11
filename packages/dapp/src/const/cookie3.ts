import { UserOptions } from '@cookie3/analytics';

export const cookie3Config: UserOptions = {
  siteId: 405,
  staging: import.meta.env.MODE !== 'production',
};
