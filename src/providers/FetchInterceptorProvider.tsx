'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
  ZAP_QUEST_ID_SESSION_STORAGE_KEY,
} from 'src/const/quests';
import { AppPaths } from 'src/const/urls';
import getApiUrl from '@/utils/getApiUrl';
import { globalInterceptor } from '@/utils/api/global-interceptor';

export function FetchInterceptorProvider() {
  console.log('4. FetchInterceptorProvider');

  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    const handleRequest = ({ request }: { request: Request }) => {
      const apiUrl = getApiUrl();

      const zapQuestId = sessionStorage.getItem(
        ZAP_QUEST_ID_SESSION_STORAGE_KEY,
      );
      // zaps flow
      const earnOpportunitySlug = sessionStorage.getItem(
        ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
      );
      if (request.url.startsWith(apiUrl) || request.url.includes('pipeline')) {
        if (earnOpportunitySlug) {
          request.headers.append(
            'x-earn-opportunity-slug',
            earnOpportunitySlug,
          );
        }
        if (zapQuestId) {
          request.headers.append('x-zap-quest-id', zapQuestId);
        }
      }
      // scan page flow
      if (
        request.url.startsWith(apiUrl) &&
        request.url.includes('status') &&
        pathnameRef.current?.includes(AppPaths.Scan)
      ) {
        request.headers.append('x-zap-scan-id', 'biconomy-powered-tx');
      }

      console.log('Headers modified by FetchInterceptorProvider');
    };

    globalInterceptor.on('request', handleRequest);

    return () => {
      console.log('Removing request listener');
      globalInterceptor.off('request', handleRequest);
    };
  }, []);

  console.log('5. FetchInterceptorProvider done');

  return null;
}
