import { useCallback, useEffect } from 'react';
import { ZAP_QUEST_ID_SESSION_STORAGE_KEY } from 'src/const/quests';
import { useMissionStore } from 'src/stores/mission/MissionStore';

export const useZapQuestIdStorage = () => {
  const strapiQuestId = useMissionStore((state) => state.missionId);
  const handleZapQuestIdStorage = useCallback((questId?: string) => {
    if (!questId) {
      return;
    }

    const zapQuestId = sessionStorage.getItem(ZAP_QUEST_ID_SESSION_STORAGE_KEY);
    if (!zapQuestId || zapQuestId !== strapiQuestId) {
      sessionStorage.setItem(ZAP_QUEST_ID_SESSION_STORAGE_KEY, questId);
    }
  }, []);

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
