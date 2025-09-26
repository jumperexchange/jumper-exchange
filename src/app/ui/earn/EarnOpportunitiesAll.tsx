'use client';
import { Card, CardContent, Grid } from '@mui/material';
import { useState } from 'react';
import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { AtLeastNWhenLoading } from 'src/components/Cards/EarnCard/variants/shared';
import { EarnFilterBar } from 'src/components/EarnFilterBar/EarnFilterBar';
import {
  EarnFilteringProvider,
  useEarnFiltering,
} from './EarnFilteringContext';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import Stack from '@mui/system/Stack';
import { EarnOpportunitiesCards } from './EarnOpportunitiesCards';

const EarnOpportunitiesAll_ = () => {
  const {
    totalMarkets,
    forYouLoading,
    forYou,
    allLoading,
    all,
    showForYou,
    toggleForYou,
  } = useEarnFiltering();

  const [variant, setVariant] = useState<EarnCardVariant>('compact');

  return (
    <SectionCardContainer>
      <Stack direction="column" gap={3}>
        <EarnFilterBar
          isLoading={allLoading || forYouLoading}
          variant={variant}
          setVariant={setVariant}
        />
        {showForYou ? (
          <EarnOpportunitiesCards
            items={forYou}
            isLoading={forYouLoading}
            variant={variant}
          />
        ) : (
          <EarnOpportunitiesCards
            items={all}
            isLoading={allLoading}
            variant={variant}
          />
        )}
      </Stack>
    </SectionCardContainer>
  );
};

export const EarnOpportunitiesAll = () => {
  return (
    <EarnFilteringProvider>
      <EarnOpportunitiesAll_ />
    </EarnFilteringProvider>
  );
};
