'use client';
import { ZapAction } from 'src/components/Zap/ZapAction/ZapAction';
import type { ExtendedQuest } from 'src/types/questDetails';

interface ZapPageProps {
  market?: ExtendedQuest;
}

const ZapPage = ({ market }: ZapPageProps) => {
  return (
    <ZapAction
      market={market}
      detailInformation={market?.attributes.CustomInformation}
    />
  );
};

export default ZapPage;
