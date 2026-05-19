import { useSettingsStore } from 'src/stores/settings';
import { useSpindlStore } from 'src/stores/spindl';
import type { SpindlFetchData, SpindlItem } from 'src/types/spindl';
import { shallow } from 'zustand/shallow';
import { spindlItemToCardData } from './spindlMapper';

export const useSpindlProcessData = () => {
  const setSpindl = useSpindlStore((state) => state.setSpindl);
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );

  const processSpindlData = (data?: SpindlFetchData) => {
    if (Array.isArray(data?.items) && data.items.length > 0) {
      const items = data.items
        .filter((item: SpindlItem) => !disabledFeatureCards.includes(item.id))
        .map(spindlItemToCardData);
      setSpindl(items.length ? items.slice(0, 1) : []);
    }
  };

  return processSpindlData;
};
