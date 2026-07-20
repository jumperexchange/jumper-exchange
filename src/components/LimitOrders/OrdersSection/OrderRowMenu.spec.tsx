import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../vitest.setup';
import { OrderRowMenu } from './OrderRowMenu';
import type { LimitOrder as Order, TokenDto } from '@/types/jumper-backend';

vi.mock('@/hooks/useChains', () => ({
  useChains: () => ({
    chains: [],
    isSuccess: false,
    isLoading: false,
    getChainById: () => undefined,
  }),
}));

vi.mock('@/hooks/userTracking/useUserTracking', () => ({
  useUserTracking: () => ({ trackEvent: vi.fn(), trackTransaction: vi.fn() }),
}));

const FAR_FUTURE = Math.floor(
  new Date('2099-01-01T00:00:00Z').getTime() / 1000,
);
const FAR_PAST = Math.floor(new Date('2000-01-01T00:00:00Z').getTime() / 1000);

const MODIFY_LABEL = 'limitOrders.table.actions.modifyLimit';
const CANCEL_LABEL = 'limitOrders.table.actions.cancelOrder';
const REPEAT_LABEL = 'limitOrders.table.actions.repeatOrder';
const EXPLORER_LABEL = 'limitOrders.table.actions.viewOnExplorer';

const makeToken = (): TokenDto => ({
  address: '0x00000000000000000000000000000000000a11',
  chainId: 1,
  symbol: 'FOO',
  decimals: 18,
  name: 'Foo Token',
  priceUSD: '1.00',
});

const makeOrder = (overrides: Partial<Order> = {}): Order => ({
  orderId: 'order-1',
  tool: 'cowswap',
  chainId: 1,
  fromAddress: '0x00000000000000000000000000000000000b22',
  fromToken: makeToken(),
  fromAmount: '1000000000000000000',
  filledFromAmount: '0',
  toToken: makeToken(),
  toAmount: '1000000000000000000',
  filledToAmount: '0',
  createdAt: 1700000000,
  validUntil: FAR_FUTURE,
  status: 'active',
  orderType: 'fill_or_kill',
  ...overrides,
});

const openMenu = async (order: Order) => {
  render(<OrderRowMenu order={order} />);
  fireEvent.click(screen.getByRole('button'));
  await screen.findByRole('menu');
};

describe('OrderRowMenu status dispatch', () => {
  it.each([
    ['active', FAR_FUTURE, true, false],
    ['active', FAR_PAST, false, true],
    ['pending', FAR_FUTURE, true, false],
    ['pending', FAR_PAST, false, true],
    ['temporarily_invalid', FAR_FUTURE, true, false],
    ['temporarily_invalid', FAR_PAST, false, true],
    ['partially_filled', FAR_FUTURE, true, false],
    ['partially_filled', FAR_PAST, false, true],
    ['filled', FAR_FUTURE, false, true],
    ['filled', FAR_PAST, false, true],
    ['cancelled', FAR_FUTURE, false, true],
    ['cancelled', FAR_PAST, false, true],
    ['expired', FAR_FUTURE, false, true],
    ['expired', FAR_PAST, false, true],
    ['failed', FAR_FUTURE, false, true],
    ['failed', FAR_PAST, false, true],
  ] as const)(
    'status=%s validUntil=%s -> editable=%s repeatable=%s',
    async (status, validUntil, editable, repeatable) => {
      await openMenu(makeOrder({ status, validUntil }));

      if (editable) {
        expect(screen.getByText(MODIFY_LABEL)).toBeInTheDocument();
        expect(screen.getByText(CANCEL_LABEL)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(MODIFY_LABEL)).not.toBeInTheDocument();
        expect(screen.queryByText(CANCEL_LABEL)).not.toBeInTheDocument();
      }

      if (repeatable) {
        expect(screen.getByText(REPEAT_LABEL)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(REPEAT_LABEL)).not.toBeInTheDocument();
      }
    },
  );
});

describe('OrderRowMenu explorer link visibility', () => {
  it('shows the explorer link when chainId and txHash are both present', async () => {
    await openMenu(makeOrder({ chainId: 1, txHash: '0xabc' }));

    expect(screen.getByText(EXPLORER_LABEL)).toBeInTheDocument();
  });

  it('hides the explorer link when txHash is missing', async () => {
    await openMenu(makeOrder({ txHash: null }));

    expect(screen.queryByText(EXPLORER_LABEL)).not.toBeInTheDocument();
  });
});
