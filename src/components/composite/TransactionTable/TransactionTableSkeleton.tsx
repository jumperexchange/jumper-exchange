import type { FC } from 'react';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { TransactionCardSkeleton } from './components/TransactionCard';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from './constants';
import type { TransactionSummaryBaseProps } from './types';
import {
  StyledColumnHeaderDivider,
  StyledRowSection,
  StyledTableContainer,
  StyledTableHeader,
  StyledValueCell,
} from './TransactionTable.styles';

interface TransactionTableSkeletonProps extends TransactionSummaryBaseProps {
  count?: number;
  showHeader?: boolean;
}

export const TransactionTableSkeleton: FC<TransactionTableSkeletonProps> = ({
  config = TRANSACTION_SUMMARY_ROW_CONFIG,
  count = 4,
  showHeader = false,
}) => (
  <StyledTableContainer>
    {showHeader && (
      <StyledTableHeader>
        {config.columns.map((slot) => (
          <StyledValueCell key={slot.id} sx={slot.sx}>
            <StyledRowSection>
              <BaseSurfaceSkeleton
                variant="rounded"
                sx={{ height: 16, width: '50%' }}
              />
              <StyledColumnHeaderDivider />
            </StyledRowSection>
          </StyledValueCell>
        ))}
      </StyledTableHeader>
    )}
    {Array.from({ length: count }, (_, i) => (
      <TransactionCardSkeleton key={i} config={config} />
    ))}
  </StyledTableContainer>
);
