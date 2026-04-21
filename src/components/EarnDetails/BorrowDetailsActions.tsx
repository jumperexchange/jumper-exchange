'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { ModalContainer } from '@/components/core/modals/ModalContainer/ModalContainer';
import { PortfolioWidget } from '@/components/Widgets/variants/portfolio/PortfolioWidget';
import { PortfolioWidgetVariants } from '@/components/Widgets/variants/portfolio/types';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary } from '../Button';
import {
  EarnDetailsActionsButtonsContainer,
  EarnDetailsActionsContainer,
  EarnDetailsActionsHeaderContainer,
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

  return (
    <EarnDetailsActionsContainer>
      <EarnDetailsActionsHeaderContainer>
        <Typography variant="bodyXSmall" color="textSecondary">
          {t('earn.position.label')}
        </Typography>
      </EarnDetailsActionsHeaderContainer>
      <EarnDetailsActionsButtonsContainer>
        <ButtonPrimary
          onClick={() => setIsOpen(true)}
          size="large"
          sx={{ flex: 1 }}
        >
          {t('buttons.borrow', 'Borrow')}
        </ButtonPrimary>
      </EarnDetailsActionsButtonsContainer>
      <ModalContainer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ClientOnly>
          <PortfolioWidget
            widgetVariants={[PortfolioWidgetVariants.Borrow]}
            disabledWidgetVariants={[]}
            earnOpportunities={[opportunity]}
            marketId={marketId}
            sx={(theme) => ({
              maxHeight: 'calc(100vh - 12rem)',
              overflowY: 'auto',
              width: '100%',
              [theme.breakpoints.up('sm')]: { maxWidth: 436 },
            })}
          />
        </ClientOnly>
      </ModalContainer>
    </EarnDetailsActionsContainer>
  );
}
