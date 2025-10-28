'use client';

import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { useEffect } from 'react';
import {
  ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
  ZAP_QUEST_ID_SESSION_STORAGE_KEY,
} from 'src/const/quests';
import envConfig from '../config/env-config';

export function FetchInterceptorProvider() {
  useEffect(() => {
    const interceptor = new FetchInterceptor();
    interceptor.apply();

    interceptor.on('request', ({ request }) => {
      const zapQuestId = sessionStorage.getItem(
        ZAP_QUEST_ID_SESSION_STORAGE_KEY,
      );
      const earnOpportunitySlug = sessionStorage.getItem(
        ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
      );
      if (request.url.startsWith(envConfig.NEXT_PUBLIC_LIFI_API_URL)) {
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
    });

    return () => {
      interceptor.dispose();
    };
  }, []);

  return null;
}
