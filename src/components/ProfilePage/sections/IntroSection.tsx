import { AddressCard } from '../components/AddressCard/AddressCard';
import { LevelCard } from '../components/LevelCard/LevelCard';
import { RankCard } from '../components/RankCard/RankCard';
import { SectionContainer } from './Section.style';

export const IntroSection = () => {
  return (
    <SectionContainer>
      <AddressCard />
      <LevelCard />
      <RankCard />
    </SectionContainer>
  );
};
