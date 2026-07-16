import type { FC } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTransactionSummaryContent } from '../hooks';
import type {
  PortfolioTransaction,
  TransactionSummaryBaseProps,
} from '../types';
import {
  TransactionSummaryRowDesktop,
  TransactionSummaryRowDesktopSkeleton,
} from './TransactionSummaryRowDesktop';
import {
  TransactionSummaryRowMobile,
  TransactionSummaryRowMobileSkeleton,
} from './TransactionSummaryRowMobile';
import { StyledCard } from '../TransactionTable.styles';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from '../constants';

export const TransactionCardSkeleton: FC<TransactionSummaryBaseProps> = ({
  config = TRANSACTION_SUMMARY_ROW_CONFIG,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <StyledCard disableInteraction>
      {isMobile ? (
        <TransactionSummaryRowMobileSkeleton config={config} />
      ) : (
        <TransactionSummaryRowDesktopSkeleton config={config} />
      )}
    </StyledCard>
  );
};

interface TransactionCardProps extends TransactionSummaryBaseProps {
  transaction: PortfolioTransaction;
  onClick?: (transaction: PortfolioTransaction) => void;
}

export const TransactionCard: FC<TransactionCardProps> = ({
  transaction,
  config,
  onClick,
}) => {
  const isInteractive = Boolean(onClick);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const content = useTransactionSummaryContent(transaction, {
    compact: true,
  });

  return (
    <StyledCard
      disableInteraction={!isInteractive}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      onClick={isInteractive ? () => onClick?.(transaction) : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(transaction);
              }
            }
          : undefined
      }
    >
      {isMobile ? (
        <TransactionSummaryRowMobile content={content} config={config} />
      ) : (
        <TransactionSummaryRowDesktop content={content} config={config} />
      )}
    </StyledCard>
  );
};
