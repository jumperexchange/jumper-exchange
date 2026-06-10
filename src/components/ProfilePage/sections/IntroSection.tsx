import type { PerksDataAttributes } from 'src/types/strapi';
import { JumperPassCard } from '../components/JumperPassCard/JumperPassCard';
import { RankCard } from '../components/RankCard/RankCard';
import { IntroHeroRow } from './Section.style';

interface IntroSectionProps {
  perks: PerksDataAttributes[];
}

export const IntroSection = ({ perks }: IntroSectionProps) => {
  return (
    <IntroHeroRow>
      <JumperPassCard perks={perks} />
      <RankCard />
    </IntroHeroRow>
  );
};
