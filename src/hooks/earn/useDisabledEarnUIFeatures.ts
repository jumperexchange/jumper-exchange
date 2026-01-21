import type { EarnInteractionFeature } from '@/types/earn';
import type { EarnInteractionFlags } from '@/types/jumper-backend';
import { EARN_INTERACTION_KEY_MAP } from '@/types/earn';

export const useIsEarnUIFeatureDisabled = (
  feature: EarnInteractionFeature,
  interactionFlags?: EarnInteractionFlags,
) => {
  const settingKey = EARN_INTERACTION_KEY_MAP[feature];
  const isDisabled = interactionFlags?.[settingKey] === false;

  return {
    isLoading: false,
    isDisabled,
  };
};
