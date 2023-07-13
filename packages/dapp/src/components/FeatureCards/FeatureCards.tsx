import { useQuery } from '@apollo/client';
import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';
import { getFeatureCards } from '../../graphql/queries/featureCards';
import { FeatureCard } from './FeatureCard';
import { FeatureCardsContainer } from './index';

export const FeatureCards = () => {
  const { loading, error, data } = useQuery(getFeatureCards);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg' as Breakpoint));
  console.log('hello world');

  return (
    isDesktop && (
      <FeatureCardsContainer>
        {data?.featureCardCollection?.items.map((cardData, index) => {
          return (
            <FeatureCard
              error={error}
              loading={loading}
              data={cardData}
              key={`feature-card-${index}`}
            />
          );
        })}
      </FeatureCardsContainer>
    )
  );
};
