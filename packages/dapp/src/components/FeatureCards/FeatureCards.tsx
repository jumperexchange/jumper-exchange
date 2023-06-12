import { useQuery } from '@apollo/client';
import { getGlossaryById } from '../../graphql/queries/featureCards';
import { FeatureCard } from './FeatureCard';
import { FeatureCardsContainer } from './index';

export const FeatureCards = () => {
  const { loading, error, data } = useQuery(getGlossaryById);
  console.log('data', data);
  return (
    <FeatureCardsContainer>
      <FeatureCard
        error={error}
        loading={loading}
        title={data?.featureCard.title}
        subtitle={data?.featureCard.subtitle}
        gradient={data?.featureCard.gradientColor}
      />
    </FeatureCardsContainer>
  );
};
