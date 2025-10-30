import { useCallback, useEffect } from 'react';
import {
  ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
  ZAP_QUEST_ID_SESSION_STORAGE_KEY,
} from 'src/const/quests';
import { useMissionStore } from 'src/stores/mission/MissionStore';

export const useZapQuestIdStorage = () => {
  const strapiQuestId = useMissionStore((state) => state.missionId);
  const handleZapQuestIdStorage = useCallback(
    (questId?: string) => {
      if (!questId) {
        return;
      }

      const zapQuestId = sessionStorage.getItem(
        ZAP_QUEST_ID_SESSION_STORAGE_KEY,
      );
      if (!zapQuestId || zapQuestId !== strapiQuestId) {
        sessionStorage.setItem(ZAP_QUEST_ID_SESSION_STORAGE_KEY, questId);
      }
    },
    [strapiQuestId],
  );

  useEffect(() => {
    handleZapQuestIdStorage(strapiQuestId);

    const handleFocus = () => {
      handleZapQuestIdStorage(strapiQuestId);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [strapiQuestId, handleZapQuestIdStorage]);
};

export const useZapEarnOpportunitySlugStorage = (slug: string) => {
  const handleZapEarnOpportunity = useCallback(
    (earnSlug?: string) => {
      if (!earnSlug) {
        return;
      }

      const zapQuestId = sessionStorage.getItem(
        ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
      );
      if (!zapQuestId || zapQuestId !== slug) {
        sessionStorage.setItem(
          ZAP_EARN_OPPORTUNITY_SLUG_SESSION_STORAGE_KEY,
          earnSlug,
        );
      }
    },
    [slug],
  );

  useEffect(() => {
    handleZapEarnOpportunity(slug);

    const handleFocus = () => {
      handleZapEarnOpportunity(slug);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [slug, handleZapEarnOpportunity]);
};
