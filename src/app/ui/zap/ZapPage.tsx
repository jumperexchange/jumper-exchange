'use client';
import { ZapPage as ZapComponentPage } from 'src/components/Zap/ZapPage';
import { Quest } from 'src/types/loyaltyPass';
import type { ExtendedQuest } from 'src/types/questDetails';

interface ZapPageProps {
  data: Quest;
}

const ZapPage = ({ data }: ZapPageProps) => {
  return (
    <ZapComponentPage
      market={data}
      detailInformation={data.attributes?.CustomInformation}
    />
  );
};

export default ZapPage;
