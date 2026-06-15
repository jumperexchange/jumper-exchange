import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ParseKeys } from 'i18next';
import type { SxProps, Theme } from '@mui/material/styles';
import { getAvatarSize } from '@/components/core/AvatarStack/AvatarStack.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { EntityStackWithBadgeSkeleton } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadgeSkeleton';
import { EntityStackBadgePlacement } from '@/components/composite/EntityStackWithBadge/types';
import type { Token } from '@/types/tokens';
import type {
  TransactionSummaryColumnId,
  TransactionSummaryRenderFn,
  TransactionSummaryRowConfig,
  TransactionSummarySkeletonFn,
  TransactionSummaryTokenConfig,
} from '../types';
import {
  StyledColumnHeaderDivider,
  StyledRowSection,
} from '../TransactionTable.styles';

interface TransactionSummaryColumnHeaderProps {
  columnId: TransactionSummaryColumnId;
  config: TransactionSummaryRowConfig;
}

interface TransactionTokenStackProps {
  tokens: Token[];
  config: TransactionSummaryTokenConfig;
}

interface ColumnDefinition {
  label: ParseKeys;
  render: TransactionSummaryRenderFn;
  renderSkeleton: TransactionSummarySkeletonFn;
  skeletonCellSx?: SxProps<Theme>;
}

export const TransactionSummaryColumnHeader: FC<
  TransactionSummaryColumnHeaderProps
> = ({ columnId, config }) => {
  const { t } = useTranslation();
  return (
    <StyledRowSection>
      <Typography
        variant={config.descriptionVariant}
        color="textSecondary"
        sx={{ fontWeight: 500 }}
      >
        {t(COLUMN_DEFINITIONS[columnId].label)}
      </Typography>
      <StyledColumnHeaderDivider />
    </StyledRowSection>
  );
};

const TransactionTokenStack: FC<TransactionTokenStackProps> = ({
  tokens,
  config,
}) => {
  if (!tokens.length) {
    const { width, height } = getAvatarSize(config.tokenSize);
    return <Box sx={{ width, height, display: 'flex' }}>-</Box>;
  }

  const chainEntities = tokens.map((token) => ({
    chainId: token.chainId,
    chainKey: token.chainId.toString(),
  }));
  const hasMultipleChains = chainEntities.length > 1;

  return (
    <EntityStackWithBadge
      entities={tokens}
      badgeEntities={chainEntities}
      placement={
        hasMultipleChains
          ? EntityStackBadgePlacement.Inline
          : EntityStackBadgePlacement.Overlay
      }
      size={config.tokenSize}
      badgeSize={hasMultipleChains ? config.inlineBadgeSize : config.badgeSize}
      isContentVisible={false}
      spacing={{ badge: config.badgeSpacing }}
    />
  );
};

const FieldSkeleton: FC<{ width?: number | string }> = ({ width = '60%' }) => (
  <Stack sx={{ gap: 0.5 }}>
    <BaseSurfaceSkeleton variant="rounded" sx={{ height: 16, width }} />
    <BaseSurfaceSkeleton variant="rounded" sx={{ height: 12, width: '40%' }} />
  </Stack>
);

export const COLUMN_DEFINITIONS: Record<
  TransactionSummaryColumnId,
  ColumnDefinition
> = {
  amount: {
    label: 'portfolio.transactionSummary.columns.amount',
    render: (content, config) => (
      <TitleWithHint
        title={content.amountTitle}
        titleVariant={config.titleVariant}
        hint={content.amountHint}
        hintVariant={config.descriptionVariant}
        gap={config.valueGap}
        sx={{ '& > :nth-child(2)': { whiteSpace: 'pre-wrap' } }}
      />
    ),
    renderSkeleton: () => <FieldSkeleton />,
  },
  action: {
    label: 'portfolio.transactionSummary.columns.action',
    render: (content, config) => (
      <TitleWithHint
        title={content.actionTitle}
        titleVariant={config.titleVariant}
        titleDataTestId="transaction-action"
        gap={config.valueGap}
      />
    ),
    renderSkeleton: () => <FieldSkeleton width="40%" />,
  },
  assetsIn: {
    label: 'portfolio.transactionSummary.columns.assetIn',
    render: (content, config) => (
      <TransactionTokenStack tokens={content.fromTokens} config={config} />
    ),
    renderSkeleton: (config) => (
      <EntityStackWithBadgeSkeleton size={config.tokenSize} />
    ),
  },
  assetsOut: {
    label: 'portfolio.transactionSummary.columns.assetOut',
    render: (content, config) => (
      <TransactionTokenStack tokens={content.toTokens} config={config} />
    ),
    renderSkeleton: (config) => (
      <EntityStackWithBadgeSkeleton size={config.tokenSize} />
    ),
  },
  fee: {
    label: 'portfolio.transactionSummary.columns.fee',
    render: (content, config) => (
      <TitleWithHint
        title={content.feeTitle}
        titleVariant={config.titleVariant}
        hint={content.feeHint}
        hintVariant={config.descriptionVariant}
        titleDataTestId="transaction-fee"
        hintDataTestId="transaction-fee-hint"
        gap={config.valueGap}
      />
    ),
    renderSkeleton: () => <FieldSkeleton />,
  },
  date: {
    label: 'portfolio.transactionSummary.columns.date',
    render: (content, config) => (
      <TitleWithHint
        title={content.dateTitle}
        titleVariant={config.titleVariant}
        hint={content.dateHint}
        hintVariant={config.descriptionVariant}
        titleDataTestId="transaction-date"
        hintDataTestId="transaction-time"
        gap={config.valueGap}
      />
    ),
    renderSkeleton: () => <FieldSkeleton />,
  },
};
