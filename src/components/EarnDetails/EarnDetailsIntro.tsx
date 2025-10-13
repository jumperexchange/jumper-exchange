'use client';

import { FC } from 'react';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { ProtocolCard } from '../Cards/ProtocolCard/ProtocolCard';

interface EarnDetailsIntroProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading: boolean;
}

export const EarnDetailsIntro: FC<EarnDetailsIntroProps> = ({
  data,
  isLoading,
}) => {
  return data ? (
    <ProtocolCard data={data} isLoading={isLoading} />
  ) : (
    <ProtocolCard data={null} isLoading={true} />
  );
};
