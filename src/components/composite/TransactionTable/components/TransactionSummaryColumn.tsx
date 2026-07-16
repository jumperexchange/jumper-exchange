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
import {
  EntityStackBadgePlacement,
  type EntityStackHintItem,
} from '@/components/composite/EntityStackWithBadge/types';
import { EntityExplorerLink } from '@/components/composite/EntityChainStack/components/EntityExplorerLink';
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
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { TitleWithHintContainer } from '../../TitleWithHint/TitleWithHint.styles';

interface TransactionSummaryColumnHeaderProps {
  columnId: TransactionSummaryColumnId;
  config: TransactionSummaryRowConfig;
}

interface TransactionAssetStackProps {
  tokens: Token[];
  nfts: NftBalance[];
  config: TransactionSummaryRowConfig;
  amountTitle?: string;
  amountHints: string[];
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
    <StyledRowSection sx={{ width: '100%' }}>
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

const MAX_ASSET_HINT_ITEMS = 4;

const toHintItems = (
  tokens: Token[],
  amountHints: string[],
  hintVariant: TransactionSummaryRowConfig['descriptionVariant'],
) => {
  const visibleCount =
    tokens.length > MAX_ASSET_HINT_ITEMS
      ? MAX_ASSET_HINT_ITEMS - 1
      : tokens.length;

  const items: EntityStackHintItem[] = tokens
    .slice(0, visibleCount)
    .map((token, i) => ({
      key: `${token.address}-${token.chainId}`,
      label: amountHints[i] ?? '',
      hoverContent: (
        <EntityExplorerLink
          address={token.address}
          chainId={token.chainId.toString()}
          hintVariant={hintVariant}
        />
      ),
    }));

  if (tokens.length > visibleCount) {
    items.push({
      key: 'more',
      label: `+${tokens.length - visibleCount}`,
    });
  }

  return items;
};

const TransactionAssetStack: FC<TransactionAssetStackProps> = ({
  tokens,
  nfts,
  config,
  amountTitle = '',
  amountHints,
}) => {
  const { t } = useTranslation();

  if (!tokens.length && !nfts.length) {
    const { width, height } = getAvatarSize(config.tokenSize);
    return (
      <Box sx={{ width, height, display: 'flex', alignItems: 'center' }}>-</Box>
    );
  }

  const tokenChains = toChainEntities(tokens.map((t) => t.chainId));
  const nftChains = toChainEntities(nfts.map((n) => n.chainId));
  const nftAmount = nfts.reduce((sum, nft) => sum + nft.amount, 0);

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ alignItems: 'flex-start', justifyContent: 'center' }}
    >
      {tokens.length > 0 && (
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', minWidth: 0 }}
        >
          <EntityStackWithBadge
            entities={tokens}
            badgeEntities={tokenChains}
            placement={
              tokenChains.length > 1
                ? EntityStackBadgePlacement.Inline
                : EntityStackBadgePlacement.Overlay
            }
            size={config.tokenSize}
            limit={MAX_ASSET_HINT_ITEMS}
            badgeSize={
              tokenChains.length > 1 ? config.inlineBadgeSize : config.badgeSize
            }
            spacing={{ badge: config.badgeSpacing }}
            content={{
              titleVariant: config.titleVariant,
              hintVariant: config.descriptionVariant,
              title: amountTitle,
              hintItems: toHintItems(
                tokens,
                amountHints,
                config.descriptionVariant,
              ),
              hintItemsDirection: 'column',
            }}
            contentSx={{ flex: 1, minWidth: 0 }}
            containerSx={{
              flexWrap: 'wrap',
              minWidth: 0,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
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
      <TitleWithHintContainer gap={config.valueGap}>
        <TitleWithHint
          title={content.actionTitle}
          titleVariant={config.titleVariant}
          titleDataTestId="transaction-action"
        />
        {content.protocolName && (
          <Stack spacing={0.5} direction="row" sx={{ alignItems: 'center' }}>
            <AvatarItem
              size={AvatarSize.XS}
              avatar={{
                src: content.protocolIcon,
                alt: content.protocolName,
                id: content.protocolName,
              }}
            />
            <Typography
              variant={config.descriptionVariant}
              color="textSecondary"
              data-testid="transaction-protocol"
            >
              {content.protocolName}
            </Typography>
          </Stack>
        )}
      </TitleWithHintContainer>
    ),
    renderSkeleton: () => <FieldSkeleton width="40%" />,
  },
  assetsIn: {
    label: 'portfolio.transactionSummary.columns.assetIn',
    render: (content, config) => (
      <TransactionAssetStack
        tokens={content.toTokens}
        nfts={content.toNfts}
        config={config}
        amountTitle={content.toAmountTitle}
        amountHints={content.toAmountHints}
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
        tokens={content.fromTokens}
        nfts={content.fromNfts}
        config={config}
        amountTitle={content.fromAmountTitle}
        amountHints={content.fromAmountHints}
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
  txHash: {
    label: 'portfolio.transactionSummary.columns.txHash',
    render: (content, config) => (
      <EntityExplorerLink
        address={content.txHash}
        chainId={content.chainId.toString()}
        hintVariant={config.titleVariant}
        hintColor={'textPrimary'}
        prefix="tx"
        showIcon={false}
      />
    ),
    renderSkeleton: () => <FieldSkeleton />,
  },
};
