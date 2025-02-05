import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';
import { useFeatureCardsFilter } from 'src/hooks/feature-cards/useFeatureCardsFilter';
import { usePersonalizedFeatureCards } from 'src/hooks/feature-cards/usePersonalizedFeatureCards';
import { usePersonalizedFeatureOnLevel } from 'src/hooks/feature-cards/usePersonalizedFeatureOnLevel';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useSettingsStore } from 'src/stores/settings';
import { shallow } from 'zustand/shallow';
import { FeatureCard } from '../FeatureCard';

export const PersonalizedCards = () => {
  const { account } = useAccount();
  const { points } = useLoyaltyPass(account?.address);
  const { excludedFeatureCardsFilter } = useFeatureCardsFilter();
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );
  const { data: featureCardsToDisplay } = usePersonalizedFeatureCards();
  const { featureCards: featureCardsLevel } = usePersonalizedFeatureOnLevel({
    points: points,
    enabled: !!points,
  });

  const slicedPersonalizedFeatureCards = useMemo(() => {
    const personalizedFeatureCards =
      featureCardsToDisplay && featureCardsToDisplay.length > 0
        ? featureCardsToDisplay
        : featureCardsLevel && featureCardsLevel.length > 0
          ? [featureCardsLevel[0]]
          : undefined;

    if (
      Array.isArray(personalizedFeatureCards) &&
      !!personalizedFeatureCards.length
    ) {
      return personalizedFeatureCards
        ?.filter(excludedFeatureCardsFilter)
        ?.filter(
          (el) =>
            el.attributes?.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes?.uid),
        )
        .slice(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureCardsToDisplay, featureCardsLevel]);

  return slicedPersonalizedFeatureCards?.map((cardData, index) => {
    return <FeatureCard data={cardData} key={`feature-card-p-${index}`} />;
  });
};
