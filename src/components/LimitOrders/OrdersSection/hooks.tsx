'use client';

import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { differenceInCalendarDays, isPast, parseISO } from 'date-fns';
import type { ColumnDef } from '@/components/composite/DataTable/DataTable.types';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { createExtendedToken, createTokenBalance } from '@/types/tokens';
import { EntityAvatar } from '@/components/composite/EntityAvatar/EntityAvatar';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { OrderRowMenu } from './OrderRowMenu';
import type { LimitOrder, LimitOrderToken, OrderStatus } from './types';
import { ACTIONS_COL_WIDTH, CHAIN_COL_WIDTH, NUMERIC_SX } from './constants';
import { OrderCell } from './OrderCell';

export function useOrderColumns(
  showMarketColumn: boolean,
): ColumnDef<LimitOrder>[] {
  const { t } = useTranslation();
  const { toDisplayAmount, toDisplayAmountUSD } = useTokenFormatters();

  const formatExpiry = (
    status: OrderStatus,
    expiresAt?: string,
  ): { label: string; color: string } | null => {
    if (status === 'cancelled') {
      return {
        label: t('limitOrders.table.status.cancelled'),
        color: 'error.main',
      };
    }
    if (status === 'filled') {
      return null;
    }
    const EXPIRED = {
      label: t('limitOrders.table.status.expired'),
      color: 'text.disabled',
    };
    if (status === 'expired') {
      return EXPIRED;
    }
    if (!expiresAt) {
      return null;
    }
    const expiryDate = parseISO(expiresAt);
    if (isPast(expiryDate)) {
      return EXPIRED;
    }
    const days = differenceInCalendarDays(expiryDate, new Date());
    return {
      label: t('limitOrders.table.status.days', { count: days }),
      color: 'text.secondary',
    };
  };

  function renderTokenCell(
    token: LimitOrderToken,
    amount: string,
    chainId: number,
  ): ReactNode {
    const balance = createTokenBalance(
      createExtendedToken(
        { ...token, name: token.symbol, chainId },
        token.priceUSD ?? '0',
      ),
      amount,
    );
    const tokenAmount = toDisplayAmount(balance);
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
        borderRight: '1px solid',
        borderRightColor: 'divider',
      },
      cellSx: { borderRight: '1px solid', borderRightColor: 'divider' },
      renderCell: (order) => (
        <EntityAvatar
          entity={{ chainId: order.chainId, chainKey: String(order.chainId) }}
          size={AvatarSize.LG}
        />
      ),
    },
    {
      id: 'pair',
      header: t('limitOrders.table.columns.pair'),
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
    },
    {
      id: 'sell',
      header: t('limitOrders.table.columns.sell'),
      align: 'right',
      renderCell: (order) =>
        renderTokenCell(order.fromToken, order.sellAmount, order.chainId),
    },
    {
      id: 'buy',
      header: t('limitOrders.table.columns.buy'),
      align: 'right',
      renderCell: (order) =>
        renderTokenCell(order.toToken, order.buyAmount, order.chainId),
    },
    {
      id: 'limit',
      header: t('limitOrders.table.columns.limit'),
      align: 'right',
      renderCell: (order) => (
        <OrderCell align="right" strong>
          {t('format.decimal', {
            value: Number(order.limitPrice),
            maximumFractionDigits: 6,
          })}
        </OrderCell>
      ),
    },
    {
      id: 'market',
      header: t('limitOrders.table.columns.market'),
      align: 'right',
      hidden: !showMarketColumn,
      renderCell: (order) =>
        order.marketPrice ? (
          <OrderCell align="right" muted>
            {t('format.decimal', {
              value: Number(order.marketPrice),
              maximumFractionDigits: 6,
            })}
          </OrderCell>
        ) : null,
    },
    {
      id: 'filled',
      header: t('limitOrders.table.columns.filled'),
      renderCell: (order) => <OrderCell>{order.filledPercent}%</OrderCell>,
    },
    {
      id: 'expires',
      header: t('limitOrders.table.columns.expires'),
      renderCell: (order) => {
        const expiry = formatExpiry(order.status, order.expiresAt);
        return expiry ? (
          <Typography
            variant="bodySmall"
            sx={{ color: expiry.color, ...NUMERIC_SX }}
          >
            {expiry.label}
          </Typography>
        ) : null;
      },
    },
    {
      id: 'actions',
      headerAriaLabel: t('limitOrders.table.actions.rowActions'),
      width: ACTIONS_COL_WIDTH,
      headerCellSx: { px: 1, pr: 1 },
      cellSx: { px: 1, pr: 1 },
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
    },
  ];
}
