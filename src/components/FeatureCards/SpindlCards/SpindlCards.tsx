import { useSpindlCards } from 'src/hooks/feature-cards/spindl/useSpindlCards';
import { useSpindlStore } from 'src/stores/spindl';
import { FeatureCard } from '../FeatureCard';

export const SpindlCards = () => {
  useSpindlCards();
  const spindl = useSpindlStore((state) => state.spindl);

  return spindl?.map((cardData, index) => {
    return (
      <FeatureCard data={cardData} key={`feature-card-spindle-${index}`} />
    );
  });
};
