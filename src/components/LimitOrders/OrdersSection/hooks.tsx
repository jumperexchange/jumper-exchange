'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLimitOrdersFilterStore } from '@/stores/limitOrderPrice/LimitOrdersFilterStore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { differenceInCalendarDays } from 'date-fns';
import { useAccount } from '@jumperexchange/wallet-management';
import { AvatarItem } from '@jumperexchange/shared-ui/components';
import type { ColumnDef } from '@/components/composite/DataTable/DataTable.types';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant } from '@/components/Badge/Badge.styles';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { useAccountForChainType } from '@/hooks/accounts/useAccountForChainType';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { useLimitOrdersTools } from '@/hooks/useLimitOrdersTools';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import { EntityAvatar } from '@/components/composite/EntityAvatar/EntityAvatar';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { truncateAddress } from '@/utils/addresses/truncateAddress';
import { OrderRowMenu } from './OrderRowMenu';
import {
  ACTIONS_COL_WIDTH,
  AMOUNT_COL_MAX_WIDTH,
  CHAIN_AVATAR_SIZE,
  CHAIN_COL_WIDTH,
} from './constants';
import { OrderCell, OrderCellSkeleton } from './OrderCell';
import {
  getOrderFilledPercent,
  getOrderLimitPrice,
  getOrderMarketPrice,
  isOrderExpired,
} from './utils';
import type { LimitOrder as Order, TokenDto } from '@/types/jumper-backend';
import { ChainType, type CoinKey } from '@lifi/sdk';
import { BaseSurface1Skeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

export function useOrdersFilters() {
  const { accounts } = useAccount();
  const evmAccount = useAccountForChainType(ChainType.EVM);
  const { protocolFilter, setProtocolFilter } = useLimitOrdersFilterStore();
  const [addressFilter, setAddressFilter] = useState<string>();

  const connectedAccounts = accounts.filter(
    (connectedAccount) =>
      connectedAccount.isConnected &&
      connectedAccount.address &&
      connectedAccount.chainType === ChainType.EVM,
  );
  const addressOptions = connectedAccounts.map((connectedAccount) => ({
    value: connectedAccount.address as string,
    label: truncateAddress(connectedAccount.address),
    icon: connectedAccount.connector?.icon ? (
      <AvatarItem
        size={AvatarSize.XS}
        avatar={{
          id: connectedAccount.address as string,
          src: connectedAccount.connector.icon,
          alt: connectedAccount.connector.name,
        }}
      />
    ) : undefined,
  }));
  const selectedAddress = addressFilter ?? evmAccount?.address;

  const { tools } = useLimitOrdersTools();
  const protocolOptions =
    tools?.map(({ key, name, logoURI }) => ({
      value: key,
      label: name,
      icon: (
        <AvatarItem
          size={AvatarSize.XS}
          avatar={{ id: key, src: logoURI, alt: name }}
        />
      ),
    })) ?? [];
  const selectedProtocol = protocolFilter ?? tools?.[0]?.key;

  return {
    selectedAddress,
    selectedProtocol,
    addressOptions,
    protocolOptions,
    showWalletSelect: connectedAccounts.length > 1,
    setAddressFilter,
    setProtocolFilter,
  };
}

export function useOrderColumns(isExpanded: boolean): ColumnDef<Order>[] {
  const { t } = useTranslation();
  const { toDisplayAmount, toDisplayAmountUSD } = useTokenFormatters();

  const formatExpiry = (
    order: Order,
  ): { label: string; variant: BadgeVariant } | null => {
    if (order.status === 'cancelled') {
      return {
        label: t('limitOrders.table.status.cancelled'),
        variant: BadgeVariant.Error,
      };
    }
    if (order.status === 'filled') {
      return {
        label: t('limitOrders.table.status.filled'),
        variant: BadgeVariant.Success,
      };
    }
    if (order.status === 'failed') {
      return {
        label: t('limitOrders.table.status.failed'),
        variant: BadgeVariant.Error,
      };
    }
    if (order.status === 'temporarily_invalid') {
      return {
        label: t('limitOrders.table.status.temporarilyInvalid'),
        variant: BadgeVariant.Warning,
      };
    }
    if (isOrderExpired(order)) {
      return {
        label: t('limitOrders.table.status.expired'),
        variant: BadgeVariant.Disabled,
      };
    }
    if (!order.validUntil) {
      return null;
    }
    const days = differenceInCalendarDays(
      new Date(order.validUntil * 1000),
      new Date(),
    );
    return {
      label: t('limitOrders.table.status.days', { count: days }),
      variant: BadgeVariant.Secondary,
    };
  };

  function renderTokenCell(
    token: TokenDto,
    amount: string,
    chainId: number,
  ): ReactNode {
    const balance = createTokenBalance(
      createExtendedToken(
        {
          ...token,
          name: token.symbol,
          coinKey: (token.coinKey as CoinKey) ?? undefined,
          logoURI: token.logoURI ?? '',
          chainId,
        },
        token.priceUSD ?? '0',
      ),
      amount,
    );
    const tokenAmount = toDisplayAmount(balance, '', {
      compact: !isExpanded,
      hideSymbol: true,
    });
    const tokenAmountSymbol = toDisplayAmount(balance, balance.token.symbol);
    const tokenAmountUsd = token.priceUSD
      ? toDisplayAmountUSD(balance)
      : undefined;
    return (
      <OrderCell align="right">
        {tokenAmountUsd ? (
          <Tooltip title={`${tokenAmountSymbol} = ${tokenAmountUsd}`}>
            <span>{tokenAmount}</span>
          </Tooltip>
        ) : (
          tokenAmount
        )}
      </OrderCell>
    );
  }

  return [
    {
      id: 'chain',
      header: t('limitOrders.table.columns.chain'),
      width: CHAIN_COL_WIDTH,
      headerCellSx: {
        zIndex: 3,
      },
      cellSx: { borderBottom: 'none' },
      renderCell: (order) => (
        <EntityAvatar
          entity={{ chainId: order.chainId, chainKey: String(order.chainId) }}
          size={AvatarSize.LG}
        />
      ),
      renderSkeleton: () => (
        <BaseSurface1Skeleton
          variant="circular"
          sx={{ width: CHAIN_AVATAR_SIZE, height: CHAIN_AVATAR_SIZE }}
        />
      ),
    },
    {
      id: 'pair',
      header: t('limitOrders.table.columns.pair'),
      cellSx: { borderBottom: 'none' },
      renderCell: (order) => (
        <Stack
          direction="row"
          sx={{ alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}
        >
          <Typography variant="bodySmallStrong">
            {order.fromToken.symbol}
          </Typography>
          <ArrowForwardIcon
            sx={{
              width: 12,
              height: 12,
              color: 'text.disabled',
              flexShrink: 0,
            }}
            aria-hidden
          />
          <Typography variant="bodySmallStrong">
            {order.toToken.symbol}
          </Typography>
        </Stack>
      ),
      renderSkeleton: () => <OrderCellSkeleton width="72px" />,
    },
    {
      id: 'sell',
      header: t('limitOrders.table.columns.sell'),
      align: 'right',
      cellSx: {
        borderBottom: 'none',
        maxWidth: AMOUNT_COL_MAX_WIDTH,
        overflow: 'hidden',
      },
      renderCell: (order) =>
        renderTokenCell(order.fromToken, order.fromAmount, order.chainId),
      renderSkeleton: () => <OrderCellSkeleton width="72%" align="right" />,
    },
    {
      id: 'buy',
      header: t('limitOrders.table.columns.buy'),
      align: 'right',
      cellSx: {
        borderBottom: 'none',
        maxWidth: AMOUNT_COL_MAX_WIDTH,
        overflow: 'hidden',
      },
      renderCell: (order) =>
        renderTokenCell(order.toToken, order.toAmount, order.chainId),
      renderSkeleton: () => <OrderCellSkeleton width="72%" align="right" />,
    },
    {
      id: 'limit',
      header: t('limitOrders.table.columns.limit'),
      align: 'right',
      cellSx: {
        borderBottom: 'none',
        maxWidth: AMOUNT_COL_MAX_WIDTH,
        overflow: 'hidden',
      },
      renderCell: (order) => {
        const limitPrice = getOrderLimitPrice(order);
        if (limitPrice == null) {
          return null;
        }
        return (
          <OrderCell align="right" strong>
            {t(`format.${isExpanded ? 'decimal' : 'decimalCompact'}`, {
              value: limitPrice,
              maximumFractionDigits: 2,
            })}
          </OrderCell>
        );
      },
      renderSkeleton: () => <OrderCellSkeleton width="56%" align="right" />,
    },
    {
      id: 'market',
      header: t('limitOrders.table.columns.market'),
      align: 'right',
      hidden: !isExpanded,
      cellSx: {
        borderBottom: 'none',
        maxWidth: AMOUNT_COL_MAX_WIDTH,
        overflow: 'hidden',
      },
      renderCell: (order) => {
        const marketPrice = getOrderMarketPrice(order);
        if (marketPrice == null) {
          return null;
        }
        return (
          <OrderCell align="right" muted>
            {t(`format.${isExpanded ? 'decimal' : 'decimalCompact'}`, {
              value: marketPrice,
              maximumFractionDigits: 2,
            })}
          </OrderCell>
        );
      },
      renderSkeleton: () => <OrderCellSkeleton width="56%" align="right" />,
    },
    {
      id: 'filled',
      header: t('limitOrders.table.columns.filled'),
      cellSx: { borderBottom: 'none' },
      renderCell: (order) => (
        <OrderCell>{getOrderFilledPercent(order)}%</OrderCell>
      ),
      renderSkeleton: () => <OrderCellSkeleton width={40} />,
    },
    {
      id: 'expires',
      header: t('limitOrders.table.columns.expires'),
      cellSx: { borderBottom: 'none' },
      renderCell: (order) => {
        const expiry = formatExpiry(order);
        return expiry ? (
          <Badge label={expiry.label} variant={expiry.variant} />
        ) : null;
      },
      renderSkeleton: () => <OrderCellSkeleton width={72} />,
    },
    {
      id: 'actions',
      headerAriaLabel: t('limitOrders.table.actions.rowActions'),
      width: ACTIONS_COL_WIDTH,
      headerCellSx: { px: 1, pr: 1 },
      cellSx: { px: 1, pr: 1, borderBottom: 'none' },
      renderCell: (order) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <OrderRowMenu order={order} />
        </Box>
      ),
      renderSkeleton: () => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <BaseSurface1Skeleton
            variant="circular"
            sx={{ width: 24, height: 24 }}
          />
        </Box>
      ),
    },
  ];
}
