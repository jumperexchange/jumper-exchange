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
    apiUrl = `${apiUrl.replace('p/lifi', 'pipeline')}/beta`;
  }

  return apiUrl;
};

export default getApiUrl;
