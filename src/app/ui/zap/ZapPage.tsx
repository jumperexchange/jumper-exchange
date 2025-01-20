'use client';
import { ZapPage as ZapComponentPage } from 'src/components/Zap/ZapPage';
import type { ExtendedQuest } from 'src/types/questDetails';

interface ZapPageProps {
  market?: ExtendedQuest;
}

const ZapPage = ({ market }: ZapPageProps) => {
  return (
    <ZapComponentPage
      market={market}
      detailInformation={market?.attributes?.CustomInformation}
    />
  );
};

export default ZapPage;
