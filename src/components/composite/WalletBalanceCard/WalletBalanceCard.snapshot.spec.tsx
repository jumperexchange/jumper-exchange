import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../vitest.setup';
import { WalletBalanceCard } from './WalletBalanceCard';
import { walletBalanceCardFixture } from './fixtures';

const MOCK_WALLET_ADDRESS = '0x1234567890123456789012345678901234567890';

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({
    accounts: [
      {
        address: MOCK_WALLET_ADDRESS,
        chainId: 1,
        isConnected: true,
        connector: undefined,
      },
    ],
  }),
  useAccountDisconnect: () => vi.fn(),
  getConnectorIcon: () => undefined,
}));

vi.mock('src/hooks/useMainPaths', () => ({
  useMainPaths: () => ({ isMainPaths: true }),
}));

vi.mock('src/stores/menu', () => ({
  useMenuStore: (selector: (state: any) => any) =>
    selector({
      setWalletMenuState: vi.fn(),
      closeAllMenus: vi.fn(),
      setSnackbarState: vi.fn(),
    }),
}));

vi.mock('@/stores/menu', () => ({
  useMenuStore: (selector: (state: any) => any) =>
    selector({
      setWalletMenuState: vi.fn(),
      closeAllMenus: vi.fn(),
      setSnackbarState: vi.fn(),
    }),
}));

vi.mock('src/stores/widgetCache', () => ({
  useWidgetCacheStore: (selector: (state: any) => any) =>
    selector({ setFrom: vi.fn() }),
}));

vi.mock('@/stores/settings', () => ({
  useSettingsStore: (selector: (state: any) => any) =>
    selector({ setWelcomeScreenClosed: vi.fn() }),
}));

vi.mock('@/stores/settings/SettingsStore', () => ({
  useSettingsStore: (selector: (state: any) => any) =>
    selector({ setWelcomeScreenClosed: vi.fn() }),
}));

vi.mock('@/stores/portfolio', () => ({
  usePortfolioStore: (selector: (state: any) => any) =>
    selector({ deleteCacheTokenAddress: vi.fn() }),
}));

vi.mock('@/hooks/useChains', () => ({
  useChains: () => ({ chains: [], getChainById: () => undefined }),
}));

vi.mock('@/hooks/useMultisig', () => ({
  useMultisig: () => ({ isSafe: false }),
}));

vi.mock('@/hooks/userTracking/useUserTracking', () => ({
  useUserTracking: () => ({ trackEvent: vi.fn() }),
}));

vi.mock('@/hooks/images/useGetColorsFromImage', () => ({
  useGetColorsFromImage: () => [],
  useDominantColorFromImage: () => null,
}));

vi.mock('@/hooks/tokens/usePortfolioFormatters', () => ({
  usePortfolioFormatters: () => ({
    toAggregatedAmount: () => '0',
    toAggregatedAmountUSD: () => 0,
    toDisplayAggregatedAmountUSD: () => '$0.00',
    toDisplayAggregatedAmount: () => '0',
  }),
}));

vi.mock('src/hooks/useTokens', () => ({
  useTokens: () => ({
    data: undefined,
    getToken: () => undefined,
    getTokenByAddressAndChain: () => undefined,
    isSuccess: false,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('react-animated-counter', () => ({
  AnimatedCounter: ({ value }: { value: number }) => <span>{value}</span>,
}));

describe('WalletBalanceCard snapshot', () => {
  it('with error renders alert', async () => {
    const { container } = render(
      <WalletBalanceCard
        {...walletBalanceCardFixture}
        data={{}}
        error={new Error('Failed to load balances')}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('without error renders normally', async () => {
    const { container } = render(
      <WalletBalanceCard {...walletBalanceCardFixture} />,
    );
    expect(container).toMatchSnapshot();
  });
});
