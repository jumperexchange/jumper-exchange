'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
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

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0 });

  useEffect(() => {
    if (isLoading && !isInView) {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isLoading, isInView]);

  return (
    <>
      <SectionCardContainer
        ref={sectionRef}
        sx={(theme) => ({
          padding: theme.spacing(2),
          [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3),
          },
        })}
      >
        <Stack
          direction="column"
          gap={{
            xs: 2,
            md: 3,
          }}
        >
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
