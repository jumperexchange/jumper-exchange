'use client';

import { FC, useState } from 'react';
import { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { EarnFilterBar } from 'src/components/EarnFilterBar/EarnFilterBar';
import {
  EarnFilteringProvider,
  useEarnFiltering,
} from '../EarnFilteringContext';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import Stack from '@mui/system/Stack';
import { EarnOpportunitiesCards } from '../EarnOpportunitiesCards';
import { DepositFlowModal } from 'src/components/composite/DepositFlow/DepositFlow';

const EarnOpportunitiesAllInner = () => {
  const { data, isLoading, error, isAllDataLoading } = useEarnFiltering();

  const [variant, setVariant] = useState<EarnCardVariant>('compact');

  return (
    <>
      <SectionCardContainer>
        <Stack direction="column" gap={3}>
          <EarnFilterBar
            isLoading={isAllDataLoading}
            variant={variant}
            setVariant={setVariant}
          />
          <EarnOpportunitiesCards
            items={data}
            isLoading={isLoading}
            variant={variant}
          />
        </Stack>
      </SectionCardContainer>
      <DepositFlowModal />
    </>
  );
};

interface EarnOpportunitiesAllProps {}

export const EarnOpportunitiesAll: FC<EarnOpportunitiesAllProps> = () => {
  return (
    <EarnFilteringProvider>
      <EarnOpportunitiesAllInner />
    </EarnFilteringProvider>
  );
};
