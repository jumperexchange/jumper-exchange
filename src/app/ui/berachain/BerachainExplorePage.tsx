'use client';
import { BerachainExploreProtocol } from 'src/components/Berachain/BerachainExploreProtocol';
import type { BerachainMarketType } from 'src/components/Berachain/const/berachainExampleData';

interface BerachainExplorePageProps {
  market?: BerachainMarketType;
}

const BerachainExplorePage = ({ market }: BerachainExplorePageProps) => {
  return <BerachainExploreProtocol market={market} />;
};

export default BerachainExplorePage;
