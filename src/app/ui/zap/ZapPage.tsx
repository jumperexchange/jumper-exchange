'use client';
import { ZapAction } from 'src/components/Zap/ZapAction/ZapAction';
import type { ExtendedQuest } from 'src/types/questDetails';

interface ZapPageProps {
  market?: {
    data: ExtendedQuest[];
  };
}

const ZapPage = ({ market }: ZapPageProps) => {
  return (
    <ZapAction
      market={market?.data?.[0]}
      detailInformation={market?.data?.[0]?.attributes?.CustomInformation}
    />
  );
};

export default ZapPage;
