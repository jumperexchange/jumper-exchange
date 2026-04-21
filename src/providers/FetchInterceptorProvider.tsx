'use client';

import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
  ZAP_QUEST_ID_SESSION_STORAGE_KEY,
} from 'src/const/quests';
import {
  HEADER_LOOPOOR_LEVERAGE_FACTOR,
  HEADER_LOOPOOR_MARKET_ID,
  LOOPOOR_LEVERAGE_FACTOR_SESSION_STORAGE_KEY,
  LOOPOOR_MARKET_ID_SESSION_STORAGE_KEY,
} from 'src/const/loopoor';
import getApiUrl from '@/utils/getApiUrl';

export function FetchInterceptorProvider() {
  console.log('4. FetchInterceptorProvider');

  const pathname = usePathname();
  const apiUrl = getApiUrl();

  useEffect(() => {
    const interceptor = new FetchInterceptor();
    interceptor.apply();

    interceptor.on('request', ({ request }) => {
      const zapQuestId = sessionStorage.getItem(
        ZAP_QUEST_ID_SESSION_STORAGE_KEY,
      );
      // zaps flow
      const earnOpportunitySlug = sessionStorage.getItem(
        ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
      );
      const loopoorMarketId = sessionStorage.getItem(
        LOOPOOR_MARKET_ID_SESSION_STORAGE_KEY,
      );
      const loopoorLeverageFactor = sessionStorage.getItem(
        LOOPOOR_LEVERAGE_FACTOR_SESSION_STORAGE_KEY,
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
        if (loopoorMarketId) {
          request.headers.append(HEADER_LOOPOOR_MARKET_ID, loopoorMarketId);
        }
        if (loopoorLeverageFactor) {
          request.headers.append(
            HEADER_LOOPOOR_LEVERAGE_FACTOR,
            loopoorLeverageFactor,
          );
        }
      }
    });

    return () => {
      interceptor.dispose();
    };
  }, [apiUrl]);

  console.log('5. FetchInterceptorProvider done');

  return null;
}
