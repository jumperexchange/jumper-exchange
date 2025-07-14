import { useContext } from 'react';
import { AddressCard } from '../components/AddressCard/AddressCard';
import { LevelCard } from '../components/LevelCard/LevelCard';
import { RankCard } from '../components/RankCard/RankCard';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { SectionContainer } from './Section.style';

export const IntroSection = () => {
  const { walletAddress } = useContext(ProfileContext);
  return (
    <SectionContainer>
      <AddressCard address={walletAddress} />
      <LevelCard />
      <RankCard address={walletAddress} />
    </SectionContainer>
  );
};
