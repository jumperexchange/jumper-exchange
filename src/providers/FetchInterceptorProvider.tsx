'use client';

import { useEffect } from 'react';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import envConfig from '../config/env-config';
import { ZAP_QUEST_ID_SESSION_STORAGE_KEY } from 'src/const/quests';

export function FetchInterceptorProvider() {
  useEffect(() => {
    const interceptor = new FetchInterceptor();
    interceptor.apply();

    interceptor.on('request', ({ request }) => {
      const zapQuestId = sessionStorage.getItem(
        ZAP_QUEST_ID_SESSION_STORAGE_KEY,
      );
      console.log(request.method, request.url, zapQuestId);
      if (
        request.url.startsWith(envConfig.NEXT_PUBLIC_LIFI_API_URL) &&
        request.url.includes('routes')
      ) {
        request.headers.append('x-zap-quest-id', zapQuestId || '');
      }
    });

    return () => {
      interceptor.dispose();
    };
  }, []);

  return null;
}
