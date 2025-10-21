'use client';

import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { useEffect } from 'react';
import { ZAP_QUEST_ID_SESSION_STORAGE_KEY } from 'src/const/quests';
import envConfig from '../config/env-config';

export function FetchInterceptorProvider() {
  useEffect(() => {
    const interceptor = new FetchInterceptor();
    interceptor.apply();

    interceptor.on('request', ({ request }) => {
      const zapQuestId = sessionStorage.getItem(
        ZAP_QUEST_ID_SESSION_STORAGE_KEY,
      );
      // zaps flow
      if (request.url.startsWith(envConfig.NEXT_PUBLIC_LIFI_API_URL)) {
        request.headers.append('x-zap-quest-id', zapQuestId || '');
      }
      // scan page flow
      if (request.url.startsWith(envConfig.NEXT_PUBLIC_LIFI_API_URL) && request.url.includes('status')) {
        request.headers.append('x-zap-scan-id', 'biconomy-powered-tx');
      }
    });

    return () => {
      interceptor.dispose();
    };
  }, []);

  return null;
}
