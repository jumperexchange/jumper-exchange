import { FeatureCard } from './FeatureCard';
import { FeatureCardsContainer } from './index';

export const FeatureCards = () => {
  return (
    <FeatureCardsContainer>
      <FeatureCard
        title="Introducing insurance"
        subtitle="Insure 100% of tokens in transit from hacks and exploits"
      />
    </FeatureCardsContainer>
  );
};
