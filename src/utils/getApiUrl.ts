import config from '@/config/env-config';
import {
  ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
  ZAP_QUEST_ID_SESSION_STORAGE_KEY,
} from 'src/const/quests';
const getApiUrl = (): string => {
  let apiUrl = config.NEXT_PUBLIC_LIFI_API_URL;
  if (typeof window === 'undefined') {
    return apiUrl;
  }

  const isBetaEnabled = window?.localStorage.getItem('use-beta');

  if (isBetaEnabled) {
    apiUrl = `${apiUrl}/beta`;
  }

  if (typeof window !== 'undefined') {
    const hasZapQuestId = sessionStorage.getItem(
      ZAP_QUEST_ID_SESSION_STORAGE_KEY,
    );
    // zaps flow
    const hasEarnOpportunitySlug = sessionStorage.getItem(
      ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
    );

    return hasZapQuestId || hasEarnOpportunitySlug
      ? apiUrl.replace('p/lifi', 'pipeline')
      : apiUrl;
  }

  return apiUrl;
};

export default getApiUrl;
