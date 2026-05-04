'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BorrowModal } from '@/components/composite/BorrowModal/BorrowModal';
import { LoopoorDemoButton } from '@/components/Widgets/variants/portfolio/loopoor/LoopoorDemoButton';
import { useLoopoorMarkets } from '@/hooks/loopoor/useLoopoorMarkets';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { ButtonPrimary } from '../Button';
import {
  EarnDetailsActionsButtonsContainer,
  EarnDetailsActionsContainer,
} from './EarnDetails.styles';

interface BorrowDetailsActionsProps {
  opportunity: EarnOpportunityWithLatestAnalytics;
  marketId: string;
}

export function BorrowDetailsActions({
  opportunity,
  marketId,
}: BorrowDetailsActionsProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const chainId = opportunity.asset.chain.chainId;
  const { data: markets } = useLoopoorMarkets({ chainId });
  const market = markets?.find((m) => m.marketId === marketId);

  return (
    <EarnDetailsActionsContainer>
      {/* <EarnDetailsActionsHeaderContainer>
        <Typography variant="bodyXSmall" color="textSecondary">
          {t('earn.position.label')}
        </Typography>
      </EarnDetailsActionsHeaderContainer> */}
      <EarnDetailsActionsButtonsContainer>
        {/* <LoopoorDemoButton /> */}
        <ButtonPrimary
          onClick={() => setIsOpen(true)}
          size="large"
          sx={{ flex: 1 }}
          disabled={!market}
        >
          Leverage
        </ButtonPrimary>
      </EarnDetailsActionsButtonsContainer>
      {market && (
        <BorrowModal
          market={market}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </EarnDetailsActionsContainer>
  );
}
