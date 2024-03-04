import { useCallback } from 'react';

export const useTrackApiEvent = () => {
  const trackApiEvent = useCallback(
    async (userId: string, event: string, eventData: any) => {
      const controller = new AbortController();
      const { signal } = controller;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_TRACK_API_URL}/track`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, event, eventData }),
            signal: signal,
          },
        );

        if (!response.ok) {
          throw new Error('Failed to track event');
        }

        console.log('Event tracked successfully');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error tracking event:', error);
        }
      }

      return () => {
        controller.abort();
      };
    },
    [],
  );

  return { trackApiEvent };
};
