import { QueryClient } from '@tanstack/react-query';
import { FIVE_MINUTES_MS } from '@/const/time';

export const createServerQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: FIVE_MINUTES_MS,
      },
    },
  });
