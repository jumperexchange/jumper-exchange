'use client';
import type { ReactNode } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { OrderRowMenu } from './OrderRowMenu';
import type { LimitOrder, OrderStatus } from './types';
import { EntityAvatar } from '../composite/EntityAvatar/EntityAvatar';
import { AvatarSize } from '../core/AvatarStack/AvatarStack.types';

interface OrdersTableProps {
  orders: LimitOrder[];
  onCancelOrder?: (order: LimitOrder) => void;
  showMarketColumn?: boolean;
  stickyHeader?: boolean;
}

const ROW_HEIGHT = 56;
const CHAIN_COL_WIDTH = 72;
const ACTIONS_COL_WIDTH = 48;

const HEADER_CELL_SX = {
  color: 'text.secondary',
  borderBottom: '1px solid',
  borderColor: 'divider',
  height: 40,
  py: 0,
  px: 1.5,
  pr: 2,
  typography: 'bodySmall',
  fontWeight: 400,
  textTransform: 'none',
} as const;

const CELL_SX = {
  borderBottom: '1px solid',
  borderColor: 'divider',
  height: ROW_HEIGHT,
  py: 0,
  px: 1.5,
  pr: 2,
  verticalAlign: 'middle',
} as const;

const NUMERIC_SX = {
  fontVariantNumeric: 'tabular-nums',
} as const;

function formatAmount(raw: string, decimals: number): string {
  const num = Number(raw) / 10 ** decimals;
  if (isNaN(num)) {
    return raw;
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function formatPrice(value: string): string {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function formatExpiry(
  status: OrderStatus,
  expiresAt?: string,
): { label: string; color: string } | null {
  if (status === 'cancelled') {
    return { label: 'Cancelled', color: 'error.main' };
  }
  if (status === 'expired') {
    return { label: 'Expired', color: 'text.disabled' };
  }
  if (status === 'filled') {
    return null;
  }

  if (!expiresAt) {
    return null;
  }

  const msRemaining = new Date(expiresAt).getTime() - Date.now();
  if (msRemaining <= 0) {
    return { label: 'Expired', color: 'text.disabled' };
  }

  const days = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  return {
    label: `${days} day${days !== 1 ? 's' : ''}`,
    color: 'text.secondary',
  };
}

const ChainCell = ({ chainId }: { chainId: number }) => {
  return (
    <EntityAvatar
      entity={{ chainId: chainId, chainKey: String(chainId) }}
      size={AvatarSize.LG}
    />
  );
};

const PairLabel = ({
  fromSymbol,
  toSymbol,
}: {
  fromSymbol: string;
  toSymbol: string;
}) => (
  <Stack
    direction="row"
    sx={{ alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}
  >
    <Typography variant="bodySmallStrong">{fromSymbol}</Typography>
    <ArrowForwardIcon
      sx={{ width: 12, height: 12, color: 'text.disabled', flexShrink: 0 }}
      aria-hidden
    />
    <Typography variant="bodySmallStrong">{toSymbol}</Typography>
  </Stack>
);

const DataCell = ({
  children,
  align = 'left',
  strong,
  muted,
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  strong?: boolean;
  muted?: boolean;
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      width: '100%',
    }}
  >
    <Typography
      variant={strong ? 'bodySmallStrong' : 'bodySmall'}
      sx={{
        ...NUMERIC_SX,
        ...(muted && { color: 'text.disabled' }),
      }}
    >
      {children}
    </Typography>
  </Box>
);

export const OrdersTable = ({
  orders,
  onCancelOrder,
  showMarketColumn = false,
  stickyHeader = false,
}: OrdersTableProps) => {
  const stickyHeaderCellSx = stickyHeader
    ? {
        position: 'sticky' as const,
        top: 0,
        zIndex: 2,
        backgroundColor: 'surface2.main',
      }
    : {};

  const stickyChainHeaderCellSx = stickyHeader
    ? { ...stickyHeaderCellSx, zIndex: 3 }
    : {};

  const table = (
    <Table
      sx={{
        width: 'max-content',
        minWidth: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              ...HEADER_CELL_SX,
              ...stickyChainHeaderCellSx,
              width: CHAIN_COL_WIDTH,
              minWidth: CHAIN_COL_WIDTH,
              borderRight: '1px solid',
              borderRightColor: 'divider',
            }}
          >
            Chain
          </TableCell>
          <TableCell sx={{ ...HEADER_CELL_SX, ...stickyHeaderCellSx }}>
            Pair
          </TableCell>
          <TableCell
            sx={{
              ...HEADER_CELL_SX,
              ...stickyHeaderCellSx,
              textAlign: 'right',
            }}
          >
            Sell
          </TableCell>
          <TableCell
            sx={{
              ...HEADER_CELL_SX,
              ...stickyHeaderCellSx,
              textAlign: 'right',
            }}
          >
            Buy
          </TableCell>
          <TableCell
            sx={{
              ...HEADER_CELL_SX,
              ...stickyHeaderCellSx,
              textAlign: 'right',
            }}
          >
            Limit
          </TableCell>
          {showMarketColumn && (
            <TableCell
              sx={{
                ...HEADER_CELL_SX,
                ...stickyHeaderCellSx,
                textAlign: 'right',
              }}
            >
              Market
            </TableCell>
          )}
          <TableCell sx={{ ...HEADER_CELL_SX, ...stickyHeaderCellSx }}>
            Filled
          </TableCell>
          <TableCell sx={{ ...HEADER_CELL_SX, ...stickyHeaderCellSx }}>
            Expires
          </TableCell>
          <TableCell
            sx={{
              ...HEADER_CELL_SX,
              ...stickyHeaderCellSx,
              width: ACTIONS_COL_WIDTH,
              minWidth: ACTIONS_COL_WIDTH,
              px: 1,
              pr: 1,
            }}
            aria-label="Row actions"
          />
        </TableRow>
      </TableHead>

      <TableBody>
        {orders.map((order) => {
          const expiry = formatExpiry(order.status, order.expiresAt);

          return (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td': { borderBottom: 0 } }}
            >
              <TableCell
                sx={{
                  ...CELL_SX,
                  width: CHAIN_COL_WIDTH,
                  minWidth: CHAIN_COL_WIDTH,
                  borderRight: '1px solid',
                  borderRightColor: 'divider',
                }}
              >
                <ChainCell chainId={order.chainId} />
              </TableCell>

              <TableCell sx={CELL_SX}>
                <PairLabel
                  fromSymbol={order.fromToken.symbol}
                  toSymbol={order.toToken.symbol}
                />
              </TableCell>

              <TableCell sx={CELL_SX}>
                <DataCell align="right">
                  {formatAmount(order.sellAmount, order.fromToken.decimals)}
                </DataCell>
              </TableCell>

              <TableCell sx={CELL_SX}>
                <DataCell align="right">
                  {formatAmount(order.buyAmount, order.toToken.decimals)}
                </DataCell>
              </TableCell>

              <TableCell sx={CELL_SX}>
                <DataCell align="right" strong>
                  {formatPrice(order.limitPrice)}
                </DataCell>
              </TableCell>

              {showMarketColumn && (
                <TableCell sx={CELL_SX}>
                  {order.marketPrice ? (
                    <DataCell align="right" muted>
                      {formatPrice(order.marketPrice)}
                    </DataCell>
                  ) : null}
                </TableCell>
              )}

              <TableCell sx={CELL_SX}>
                <DataCell>{order.filledPercent}%</DataCell>
              </TableCell>

              <TableCell sx={CELL_SX}>
                {expiry && (
                  <Typography
                    variant="bodySmall"
                    sx={{ color: expiry.color, ...NUMERIC_SX }}
                  >
                    {expiry.label}
                  </Typography>
                )}
              </TableCell>

              <TableCell
                sx={{
                  ...CELL_SX,
                  width: ACTIONS_COL_WIDTH,
                  minWidth: ACTIONS_COL_WIDTH,
                  px: 1,
                  pr: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <OrderRowMenu order={order} onCancel={onCancelOrder} />
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return <Box sx={{ overflowX: 'auto', overflowY: 'visible' }}>{table}</Box>;
};
