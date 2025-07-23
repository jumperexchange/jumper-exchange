import { AddressCard } from '../components/AddressCard/AddressCard';
import { LevelCard } from '../components/LevelCard/LevelCard';
import { RankCard } from '../components/RankCard/RankCard';
import { IntroSectionContainer } from './Section.style';

export const IntroSection = () => {
  return (
    <IntroSectionContainer>
      <AddressCard />
      <LevelCard />
      <RankCard />
    </IntroSectionContainer>
  );
};
