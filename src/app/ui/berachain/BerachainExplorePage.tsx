'use client';
import { BerachainExploreProtocol } from 'src/components/Berachain/BerachainExploreProtocol';
import type { Quest } from 'src/types/loyaltyPass';

interface BerachainExplorePageProps {
  market?: Quest;
}

const BerachainExplorePage = ({ market }: BerachainExplorePageProps) => {
  return <BerachainExploreProtocol market={market} />;
};

export default BerachainExplorePage;
