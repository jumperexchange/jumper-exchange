import type { FC } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTransactionSummaryContent } from '../hooks';
import type {
  PortfolioTransaction,
  TransactionSummaryRowConfig,
} from '../types';
import { TransactionSummaryRowDesktop } from './TransactionSummaryRowDesktop';
import { TransactionSummaryRowMobile } from './TransactionSummaryRowMobile';

interface TransactionSummaryRowProps {
  transaction: PortfolioTransaction;
  config?: TransactionSummaryRowConfig;
}

export const TransactionSummaryRow: FC<TransactionSummaryRowProps> = ({
  transaction,
  config,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const content = useTransactionSummaryContent(transaction, {
    compact: isMobile,
  });

  if (isMobile) {
    return <TransactionSummaryRowMobile content={content} config={config} />;
  }

  return <TransactionSummaryRowDesktop content={content} config={config} />;
};
