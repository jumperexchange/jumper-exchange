import { useCallback, useContext } from 'react';
import { useAccounts } from './useAccounts';
import { EventCollectorContext } from '../providers/EventCollectorProvider';

type TrackingEvent = {
  name: string;
  params: { [key: string]: any };
};

export const useEventCollector = () => {
  const context = useContext(EventCollectorContext);
  const { account } = useAccounts();
  const URL = import.meta.env.VITE_EVENT_COLLECTOR_URL;

  if (context === undefined) {
    throw new Error('Context must be used within a Provider!');
  }

  const collectEvent = useCallback(
    ({ name, params }: TrackingEvent) => {
      fetch(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          clientId: context.clientId,
          userId: account?.address ?? '',
          timestamp: Date.now(),
          event: {
            name,
            params: {
              ...params,
              engagement_time_msec: 100, // TODO - using a fixed value for now, we can address this later.
              session_id: context.sessionId,
            },
          },
        }),
      });
    },
    [context.clientId, context.sessionId, account?.address],
  );

  return {
    collectEvent,
  };
};
