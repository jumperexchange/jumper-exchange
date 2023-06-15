import { useQuery } from '@apollo/client';
import { getFeatureCards } from '../../graphql/queries/featureCards';
import { FeatureCard } from './FeatureCard';
import { FeatureCardsContainer } from './index';

export const FeatureCards = () => {
  const { loading, error, data } = useQuery(getFeatureCards);

  return (
    <FeatureCardsContainer>
      {data?.featureCardCollection?.items.map((cardData) => {
        return <FeatureCard error={error} loading={loading} data={cardData} />;
      })}
    </FeatureCardsContainer>
  );
};
