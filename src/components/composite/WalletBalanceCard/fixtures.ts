import { mockMultiChainUsdcBalances } from '../BalanceCard/fixtures';

export const walletBalanceCardFixture = {
  walletAddress: '0x1234567890123456789012345678901234567890',
  updatedAt: 12345,
  refetch: () => {},
  isFetching: false,
  isSuccess: true,
  data: {
    USDC: mockMultiChainUsdcBalances,
  },
  error: null,
};
