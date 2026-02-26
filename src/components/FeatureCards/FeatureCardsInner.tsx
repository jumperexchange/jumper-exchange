import { useMemo } from 'react';
import { useSpindlCards } from 'src/hooks/feature-cards/spindl/useSpindlCards';
import { useFeatureCards } from 'src/hooks/feature-cards/useFeatureCards';
import { useSpindlStore } from 'src/stores/spindl';
import { FeatureCard } from './FeatureCard';
import { FeatureCardsContainer } from './FeatureCards.style';
import { usePersonalizedFeatureCards } from '../../hooks/feature-cards/usePersonalizedFeatureCards';

export const FeatureCardsInner = () => {
  useSpindlCards();
  const spindl = useSpindlStore((state) => state.spindl);
  const featureCards = useFeatureCards();
  const personalizedFeatureCards = usePersonalizedFeatureCards();

  const cards = useMemo(() => {
    return [
      ...(spindl ?? []),
      ...(featureCards ?? []),
      ...(personalizedFeatureCards ?? []),
    ];
  }, [spindl, featureCards, personalizedFeatureCards]);

  if (!cards.length) {
    return null;
  }

  return (
    <FeatureCardsContainer>
      {cards?.map((cardData, index) => {
        return <FeatureCard data={cardData} key={`feature-card-${index}`} />;
      })}
    </FeatureCardsContainer>
  );
};
