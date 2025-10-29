'use client';

import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ZAP_QUEST_ID_SESSION_STORAGE_KEY } from 'src/const/quests';
import envConfig from '../config/env-config';
import { AppPaths } from 'src/const/urls';

export function FetchInterceptorProvider() {
  const pathname = usePathname();
  
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
      if (request.url.startsWith(envConfig.NEXT_PUBLIC_LIFI_API_URL) && request.url.includes('status') && pathname?.includes(AppPaths.Scan)) {
        request.headers.append('x-zap-scan-id', 'biconomy-powered-tx');
      }
    });

    return () => {
      interceptor.dispose();
    };
  }, []);

  return null;
}
