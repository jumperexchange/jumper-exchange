import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButtonPrimary } from 'src/components/IconButton';
import BoltIcon from 'src/components/illustrations/BoltIcon';
import { EarnCard } from './EarnCard';

const meta = {
  component: EarnCard,
  title: 'Earn/Cards',
  argTypes: {
    primaryAction: {
      control: false,
    },
  },
} satisfies Meta<typeof EarnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonArgs = {
  data: {
    name: 'Moonwell Flagship USDC on base',
    asset: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040',
      chain: {
        chainId: 8453,
        chainKey: 'base',
      },
    },
    protocol: {
      name: 'morpho',
      product: 'metamorpho',
      version: '',
      logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
    },
    url: 'https://app.morpho.org',
    description:
      "Development Value - This value is used in our e2e tests workflows!!!\n\nLenders earn yield from interest paid by borrowers. Borrowers deposit collateral assets into Morpho's credit markets and borrow loans against their collateral. For detail on this vault’s curator and risk parameters, see [link](https://app.morpho.org/vault?vault=0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca&network=base).\n\nDescription from vault manager:\n\nThe Moonwell Flagship USDC Morpho vault curated by B.Protocol and Block Analitica is intended to optimize risk-adjusted interest earned from blue-chip collateral markets.\n\n[See more](https://app.morpho.org/vault?vault=0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca&network=base)",
    tags: ['Staking', 'Earn'],
    rewards: [],
    lpToken: {
      name: 'Moonwell Flagship USDC',
      symbol: 'mwUSDC',
      decimals: 18,
      address: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca',
      logo: 'https://moonwell.fi/_next/static/media/usdc.0f045781.svg',
      chain: {
        chainId: 8453,
        chainKey: 'base',
      },
    },
    slug: 'moonwell-flagship-usdc-on-base',
    lockupMonths: 2,
    capInDollar: '1000000000000000000',
    featured: true,
    forYou: true,
    latest: {
      date: '+057679-11-04T06:34:08.000Z',
      tvlUsd: '62572415',
      tvlNative: '62588064205976',
      apy: {
        base: 0.0558,
        reward: 0.0157,
        total: 0.07150000000000001,
      },
    },
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
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    variant: 'compact',
    primaryAction: compactPrimaryAction,
  },
};

export const CompactSingleAsset: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
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
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    variant: 'list-item',
    primaryAction: listItemPrimaryAction,
  },
};

export const ListItemSingleAsset: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
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

export const Top: Story = {
  args: {
    ...commonArgs,
    variant: 'top',
  },
};

export const TopLoading: Story = {
  args: {
    ...commonArgs,
    variant: 'top',
    isLoading: true,
  },
};

export const TopWithAction: Story = {
  args: {
    ...commonArgs,
    variant: 'top',
    primaryAction: listItemPrimaryAction,
  },
};

export const TopWithActionAndNoRecommendation: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    variant: 'top',
    primaryAction: listItemPrimaryAction,
  },
};
