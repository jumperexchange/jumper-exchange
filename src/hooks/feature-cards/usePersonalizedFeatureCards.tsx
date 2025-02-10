import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';
import { useFeatureCardsFilter } from 'src/hooks/feature-cards/useFeatureCardsFilter';
import { usePersonalizedFeatureCardsQuery } from 'src/hooks/feature-cards/usePersonalizedFeatureCardsQuery';
import { usePersonalizedFeatureOnLevel } from 'src/hooks/feature-cards/usePersonalizedFeatureOnLevel';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useSettingsStore } from 'src/stores/settings';
import { shallow } from 'zustand/shallow';

export const usePersonalizedFeatureCards = () => {
  const { account } = useAccount();
  const { points } = useLoyaltyPass(account?.address);
  const { excludedFeatureCardsFilter } = useFeatureCardsFilter();
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );
  const { data: featureCardsToDisplay } = usePersonalizedFeatureCardsQuery();
  const { featureCards: featureCardsLevel } = usePersonalizedFeatureOnLevel({
    points: points,
    enabled: !!points,
  });

  const slicedPersonalizedFeatureCards = useMemo(() => {
    const personalizedFeatureCards =
      Array.isArray(featureCardsToDisplay) && featureCardsToDisplay.length > 0
        ? featureCardsToDisplay
        : Array.isArray(featureCardsLevel) && featureCardsLevel.length > 0
          ? [featureCardsLevel[0]]
          : undefined;

    if (
      Array.isArray(personalizedFeatureCards) &&
      personalizedFeatureCards.length > 0
    ) {
      return personalizedFeatureCards
        .filter(excludedFeatureCardsFilter)
        .filter(
          (el) =>
            el.attributes?.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes?.uid),
        )
        .slice(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureCardsToDisplay, featureCardsLevel]);

  if (slicedPersonalizedFeatureCards?.length === 0) {
    return null;
  }

  return slicedPersonalizedFeatureCards;
};
