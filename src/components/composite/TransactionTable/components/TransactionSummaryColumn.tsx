import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ParseKeys } from 'i18next';
import type { SxProps, Theme } from '@mui/material/styles';
import { getAvatarSize } from '@/components/core/AvatarStack/AvatarStack.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { EntityStackWithBadgeSkeleton } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadgeSkeleton';
import { EntityStackBadgePlacement } from '@/components/composite/EntityStackWithBadge/types';
import type { Token } from '@/types/tokens';
import { truncateAddress } from '@/utils/addresses/truncateAddress';
import type {
  NftBalance,
  TransactionSummaryColumnId,
  TransactionSummaryRenderFn,
  TransactionSummaryRowConfig,
  TransactionSummarySkeletonFn,
} from '../types';
import {
  StyledColumnHeaderDivider,
  StyledRowSection,
} from '../TransactionTable.styles';
import { NFT_TOKEN_URL } from '../constants';

interface TransactionSummaryColumnHeaderProps {
  columnId: TransactionSummaryColumnId;
  config: TransactionSummaryRowConfig;
}

interface TransactionAssetStackProps {
  tokens: Token[];
  nfts: NftBalance[];
  config: TransactionSummaryRowConfig;
  amountTitle?: string;
  amountHint?: string;
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

const toChainEntities = (chainIds: number[]) =>
  [...new Set(chainIds)].map((chainId) => ({
    chainId,
    chainKey: chainId.toString(),
  }));

const TransactionAssetStack: FC<TransactionAssetStackProps> = ({
  tokens,
  nfts,
  config,
  amountTitle = '',
  amountHint = '',
}) => {
  const { t } = useTranslation();

  if (!tokens.length && !nfts.length) {
    const { width, height } = getAvatarSize(config.tokenSize);
    return <Box sx={{ width, height, display: 'flex' }}>-</Box>;
  }

  const tokenChains = toChainEntities(tokens.map((t) => t.chainId));
  const nftChains = toChainEntities(nfts.map((n) => n.chainId));
  const nftAmount = nfts.reduce((sum, nft) => sum + nft.amount, 0);

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {tokens.length > 0 && (
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', minWidth: 0 }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <EntityStackWithBadge
              entities={tokens}
              badgeEntities={tokenChains}
              placement={
                tokenChains.length > 1
                  ? EntityStackBadgePlacement.Inline
                  : EntityStackBadgePlacement.Overlay
              }
              size={config.tokenSize}
              limit={4}
              badgeSize={
                tokenChains.length > 1
                  ? config.inlineBadgeSize
                  : config.badgeSize
              }
              isContentVisible={false}
              spacing={{ badge: config.badgeSpacing }}
            />
          </Box>
          <TitleWithHint
            title={amountTitle}
            hint={amountHint}
            titleVariant={config.titleVariant}
            hintVariant={config.descriptionVariant}
            gap={config.valueGap}
            sx={{
              minWidth: 0,
              overflow: 'hidden',
              '& .MuiTypography-root:first-child': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              '& .MuiTypography-root:nth-child(2)': {
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
              },
            }}
          />
        </Stack>
      )}

      {nfts.length > 0 && (
        <Tooltip
          title={
            <Stack spacing={0.5}>
              {nfts.map((nft) => (
                <Stack key={`${nft.address}-${nft.tokenId}`}>
                  <Typography
                    key={`${nft.address}-${nft.tokenId}`}
                    variant="bodyXSmallStrong"
                  >
                    {nft.amount > 0
                      ? t('portfolio.transactionSummary.nftAmount', {
                          amount: nft.amount,
                        })
                      : ''}
                  </Typography>
                  <Typography
                    key={`${nft.address}-${nft.tokenId}`}
                    variant="bodyXSmall"
                  >
                    {truncateAddress(nft.address)} #{nft.tokenId}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          }
        >
          <Box>
            <EntityStackWithBadge
              entities={[
                {
                  logo: NFT_TOKEN_URL,
                  name: 'NFT',
                },
              ]}
              badgeEntities={nftChains}
              placement={
                nftChains.length > 1
                  ? EntityStackBadgePlacement.Inline
                  : EntityStackBadgePlacement.Overlay
              }
              size={config.tokenSize}
              badgeSize={
                nftChains.length > 1 ? config.inlineBadgeSize : config.badgeSize
              }
              content={{
                titleVariant: config.titleVariant,
                title: t('portfolio.transactionSummary.nftCount', {
                  count: nftAmount,
                }),
                hint: '',
              }}
              spacing={{ badge: config.badgeSpacing }}
            />
          </Box>
        </Tooltip>
      )}
    </Stack>
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
      <TransactionAssetStack
        tokens={content.fromTokens}
        nfts={content.fromNfts}
        config={config}
        amountTitle={content.fromAmountTitle}
        amountHint={content.fromAmountHint}
      />
    ),
    renderSkeleton: (config) => (
      <EntityStackWithBadgeSkeleton size={config.tokenSize} />
    ),
  },
  assetsOut: {
    label: 'portfolio.transactionSummary.columns.assetOut',
    render: (content, config) => (
      <TransactionAssetStack
        tokens={content.toTokens}
        nfts={content.toNfts}
        config={config}
        amountTitle={content.toAmountTitle}
        amountHint={content.toAmountHint}
      />
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
