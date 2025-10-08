import { useEffect } from 'react';
import { useMissionStore } from 'src/stores/mission/MissionStore';

export const useResetCurrentActiveTask = () => {
  const { resetCurrentActiveTask } = useMissionStore();

  useEffect(() => {
    resetCurrentActiveTask();
  }, [resetCurrentActiveTask]);
};
