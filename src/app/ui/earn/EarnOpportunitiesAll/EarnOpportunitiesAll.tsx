'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import type { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { EarnFilterBar } from 'src/components/EarnFilterBar/EarnFilterBar';
import {
  EarnFilteringProvider,
  useEarnFiltering,
} from '../EarnFilteringContext';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import Stack from '@mui/system/Stack';
import { EarnOpportunitiesCards } from '../EarnOpportunitiesCards';
import { DepositFlowModal } from 'src/components/composite/DepositFlow/DepositFlow';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { EarnViewAllMarketsButton } from '../EarnViewAllMarketsButton';
import { EarnFilterTab } from '../types';
import { EarnEmptyList } from '../EarnEmptyList/EarnEmptyList';
import { useContactSupportEvent } from '@/components/Widgets/events/hooks/useContactSupportEvent';

const EarnOpportunitiesAllInner = () => {
  useContactSupportEvent();
  const {
    data,
    isLoading,
    isAllDataLoading,
    showForYou,
    changeTab,
    showYourPositions,
  } = useEarnFiltering();

  const [variant, setVariant] = useState<EarnCardVariant>('compact');

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0, initial: true });

  const scrollToSectionTop = useCallback(() => {
    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const handleNavigateToAllMarkets = useCallback(() => {
    changeTab(EarnFilterTab.ALL);
    scrollToSectionTop();
  }, [changeTab, scrollToSectionTop]);

  useEffect(() => {
    if (isLoading && !isInView) {
      scrollToSectionTop();
    }
  }, [isLoading, isInView, scrollToSectionTop]);

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
            showPlaceholderCard={showYourPositions}
            variant={variant}
          />
          <EarnEmptyList />
          {showForYou && (
            <EarnViewAllMarketsButton onClick={handleNavigateToAllMarkets} />
          )}
        </Stack>
      </SectionCardContainer>
      <DepositFlowModal />
      <WithdrawFlowModal />
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
