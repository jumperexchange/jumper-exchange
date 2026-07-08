import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import { fn } from 'storybook/test';
import type { BaseReward } from 'src/types/rewards';
import type { PortfolioBalance, WalletToken } from 'src/types/tokens';
import { RewardClaimCard } from './RewardClaimCard';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_LOGO =
  'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png';

const availableReward: BaseReward = {
  chainId: 8453,
  address: USDC_ADDRESS,
  symbol: 'USDC',
  amountToClaim: 1,
  tokenDecimals: 6,
  logoURI: USDC_LOGO,
};

const balance: PortfolioBalance<WalletToken> = {
  amount: 1_000_000n,
  amountUSD: 1,
  token: {
    type: 'wallet',
    address: USDC_ADDRESS,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI: USDC_LOGO,
    chainId: 8453,
    chainKey: 'bas',
    priceUSD: '1',
  },
};

const meta = {
  component: RewardClaimCard,
  title: 'Profile/Reward Claim Card',
  // Sit the fixed-width card on a profile-like dark surface for context.
  decorators: [
    (Story) => (
      <Box
        sx={{
          p: 4,
          borderRadius: 6,
          backgroundColor: 'surface2.main',
          display: 'inline-flex',
        }}
      >
        <Story />
      </Box>
    ),
  ],
  args: {
    availableReward,
    balance,
    onClaim: fn(),
    isLoading: false,
    isDisabled: false,
    isConfirmed: false,
    isError: false,
    hash: undefined,
    hasPendingTx: false,
    isPendingValidation: false,
  },
} satisfies Meta<typeof RewardClaimCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};
