import { IntercomClient } from 'intercom-client';

export const createIntercomClient = (accessToken: string): IntercomClient =>
  new IntercomClient({ token: accessToken });
