'use client';

import Stack from '@mui/system/Stack';
import { useInView } from 'motion/react';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { DepositFlowModal } from 'src/components/composite/DepositFlow/DepositFlow';
import { EarnFilterBar } from 'src/components/EarnFilterBar/EarnFilterBar';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { useContactSupportEvent } from '@/components/Widgets/events/hooks/useContactSupportEvent';
import { HeaderHeight } from '@/const/headerHeight';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { EarnEmptyList } from '../EarnEmptyList/EarnEmptyList';
import {
  EarnFilteringProvider,
  useEarnFiltering,
} from '../EarnFilteringContext';
import { EarnOpportunitiesCards } from '../EarnOpportunitiesCards';
import { EarnViewAllMarketsButton } from '../EarnViewAllMarketsButton';
import { EarnFilterTab } from '../types';

const EarnOpportunitiesAllInner = () => {
  useContactSupportEvent();
  const { data, isLoading, isAllDataLoading, isConnected, tab, changeTab } =
    useEarnFiltering();

  const [variant, setVariant] = useSettingsStore((state) => [
    state.earnCardVariant,
    state.setEarnCardVariant,
  ]);

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
          scrollMarginTop: {
            xs: HeaderHeight.XS,
            sm: HeaderHeight.SM,
            md: HeaderHeight.MD,
          },
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
            showPlaceholderCard={tab === EarnFilterTab.YOUR_POSITIONS}
            variant={variant}
          />
          <EarnEmptyList />
          {tab == EarnFilterTab.FOR_YOU && isConnected && !!data.length && (
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
