import { WidgetConfig, WidgetSubvariant } from '@lifi/widget';
import { useMemo } from 'react';
import { useMissionStore } from 'src/stores/mission';
import { TaskType } from 'src/types/loyaltyPass';

export const useSubVariant = () => {
  const { currentActiveTaskType } = useMissionStore();

  const config: Partial<WidgetConfig> = useMemo(() => {
    const partialConfig: Partial<WidgetConfig> = {
      subvariant: 'default' as WidgetSubvariant,
      subvariantOptions: undefined,
    };

    if (
      currentActiveTaskType === TaskType.Zap ||
      currentActiveTaskType === TaskType.Deposit
    ) {
      partialConfig.subvariant = 'custom' as WidgetSubvariant;
      partialConfig.subvariantOptions = {
        custom: 'deposit',
      };
    }

    return partialConfig;
  }, [currentActiveTaskType]);

  return config;
};
