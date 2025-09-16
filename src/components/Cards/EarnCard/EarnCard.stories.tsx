import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EarnCard } from './EarnCard';
import { IconButtonPrimary } from 'src/components/IconButton';
import BoltIcon from 'src/components/illustrations/BoltIcon';

const meta = {
  component: EarnCard,
  title: 'Components/Cards/EarnCard',
  argTypes: {
    primaryAction: {
      control: false,
    },
  },
} satisfies Meta<typeof EarnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonArgs = {
  assets: {
    label: 'Assets',
    tooltip: 'The assets you will earn from',
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
        logo: '',
        chain: {
          chainKey: 'Ethereum',
          chainId: 1,
        },
      },
      {
        name: 'Chainlink',
        symbol: 'LINK',
        decimals: 18,
        address: '0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196',
        logo: '',
        chain: {
          chainId: 8453,
          chainKey: 'Base',
        },
      },
    ],
  },
  protocol: {
    name: 'Morpho',
    logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
    product: 'Metamorpho',
    version: '1.0.0',
  },
  link: {
    url: 'https://app.morpho.org',
    label: 'Explore Morpho',
  },
  recommended: true,
  tags: ['Staking', 'Earn'],
  lockupPeriod: {
    label: 'Lockup Period',
    tooltip: 'The lockup period is the time you need to lock your assets for',
    value: 1000,
    valueFormatted: '1000 months',
  },
  apy: {
    label: 'APY',
    tooltip: 'The APY is the annualized return you will receive',
    value: 1000,
    valueFormatted: '1000%',
  },
  tvl: {
    label: 'TVL',
    tooltip: 'The TVL is the total value locked in the pool',
    value: 1000,
    valueFormatted: `$${Number(1000).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  },
};

const compactPrimaryAction = (
  <IconButtonPrimary
    sx={(theme) => ({
      color: `${(theme.vars || theme).palette.white.main} !important`,
    })}
  >
    <BoltIcon />
  </IconButtonPrimary>
);

const listItemPrimaryAction = (
  <IconButtonPrimary
    sx={(theme) => ({
      color: `${(theme.vars || theme).palette.white.main} !important`,
      height: 40,
      width: 40,
    })}
  >
    <BoltIcon height={20} width={20} />
  </IconButtonPrimary>
);

export const Compact: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    primaryAction: compactPrimaryAction,
  },
};

export const CompactNoRecommendation: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    recommended: false,
    primaryAction: compactPrimaryAction,
  },
};

export const CompactSingleAsset: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    assets: {
      ...commonArgs.assets,
      tokens: [commonArgs.assets.tokens[0]],
    },
    primaryAction: compactPrimaryAction,
  },
};

export const CompactLoading: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    isLoading: true,
  },
};

export const ListItem: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    primaryAction: listItemPrimaryAction,
  },
};

export const ListItemNoRecommendation: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    recommended: false,
    primaryAction: listItemPrimaryAction,
  },
};

export const ListItemSingleAsset: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    assets: {
      ...commonArgs.assets,
      tokens: [commonArgs.assets.tokens[0]],
    },
    primaryAction: listItemPrimaryAction,
  },
};

export const ListItemLoading: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    isLoading: true,
  },
};
