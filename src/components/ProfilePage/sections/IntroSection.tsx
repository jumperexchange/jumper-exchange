import { JumperPassCard } from '../components/JumperPassCard/JumperPassCard';
import { RankCard } from '../components/RankCard/RankCard';
import { IntroHeroRow } from './Section.style';

export const IntroSection = () => {
  return (
    <IntroHeroRow>
      <JumperPassCard />
      <RankCard />
    </IntroHeroRow>
  );
};
