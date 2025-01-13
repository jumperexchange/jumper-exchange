'use client';
import { ZapPage } from 'src/components/Zap/ZapPage';
import type { ExtendedQuest } from 'src/types/questDetails';

interface ZapPageProps {
  market?: {
    data: ExtendedQuest[];
  };
}

const ZapPage = ({ market }: ZapPageProps) => {
  return (
    <ZapPage
      market={market?.data?.[0]}
      detailInformation={market?.data?.[0]?.attributes?.CustomInformation}
    />
  );
};

export default ZapPage;
