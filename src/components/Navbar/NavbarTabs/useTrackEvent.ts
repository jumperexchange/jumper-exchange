import { useEffect } from 'react';

const useInitTrackEvent = () => {
  const trackEvent = async (
    userId: string,
    event: string,
    eventData: any,
    signal: AbortSignal,
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_TRACK_API_URL}/track`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            event,
            eventData,
          }),
          signal,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to track event');
      }

      console.log('Event tracked successfully');
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  return trackEvent;
};

export const useTrackEvent = () => {
  const controller = new AbortController();
  const { signal } = controller;
  const trackEvent = useInitTrackEvent();

  useEffect(() => {
    const userId = 'your-user-id';
    const event = 'route_execution';
    const eventData = { tab: '' };

    trackEvent(userId, event, eventData, signal);

    return () => {
      controller.abort();
    };
  }, [trackEvent, signal]);
};
