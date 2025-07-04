import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EntityCard } from './EntityCard';
import { Badge } from '../../Badge/Badge';

const meta: Meta<typeof EntityCard> = {
  title: 'Components/Cards/Mission cards',
  component: EntityCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EntityCard>;

const apyReward = {
  value: '4.7%',
  label: 'APY',
};

const xpReward = {
  value: '25',
  label: 'XP',
};

const coinRewards = [
  {
    value: '10',
    label: 'USDC',
    avatarUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    value: '100',
    label: 'USDT',
    avatarUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
];

const extraRewards = [
  {
    value: '0.1',
    label: 'WBTC',
    avatarUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  {
    value: '2k',
    label: '1INCH',
    avatarUrl:
      'https://static.debank.com/image/eth_token/logo_url/0x111111111117dc0aa78b770fa6a738034120c302/2441b15b32406dc7d163ba4c1c6981d3.png',
  },
  {
    value: '4',
    label: 'BOB',
    avatarUrl:
      'https://assets.coingecko.com/coins/images/27266/small/Bob-logo.png?1663073030',
  },
];

const participants = [
  {
    avatarUrl:
      'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg',
    label: 'User 1',
  },
  {
    avatarUrl:
      'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg',
    label: 'User 2',
  },
];

const commonProps = {
  id: 'example-card',
  slug: 'example-entity-card',
  title: 'Explore Aerodrome on multiple chains',
  description:
    'Aerodrome is a decentralized exchange where you can execute low-fee swaps, deposit tokens to earn rewards, and actively participate in the onchain economy.',
  imageUrl:
    'https://strapi.jumper.exchange/uploads/AI_Memecoins_and_Crypto_f98c61b932.png',
  participants,
  rewardGroups: {
    apy: [apyReward],
    xp: [xpReward],
    coins: coinRewards,
  },
  partnerLink: {
    url: 'https://jumper.exchange',
    label: 'Visit Jumper Exchange',
  },
  onClick: () => console.log('Entity Card Clicked'),
  badge: <Badge label="Active" variant="secondary" />,
};

export const Compact: Story = {
  args: {
    ...commonProps,
    variant: 'compact',
  },
};

export const CompactWithRewards: Story = {
  args: {
    ...commonProps,
    rewardGroups: {
      coins: coinRewards,
    },
    variant: 'compact',
  },
};

export const CompactWithSingleReward: Story = {
  args: {
    ...commonProps,
    rewardGroups: {
      coins: [coinRewards[0]],
    },
    variant: 'compact',
  },
};

export const CompactWithSingleParticipant: Story = {
  args: {
    ...commonProps,
    participants: [participants[0]],
    variant: 'compact',
  },
};

export const CompactWithTruncatedTitle: Story = {
  args: {
    ...commonProps,
    title:
      'This is a very long title that should be truncated in the compact view to ensure it fits within the card without overflowing or breaking the layout',
    variant: 'compact',
  },
};

export const Wide: Story = {
  args: {
    ...commonProps,
    variant: 'wide',
  },
};

export const WideWithSingleParticipant: Story = {
  args: {
    ...commonProps,
    participants: [participants[0]],
    variant: 'wide',
  },
};

export const WideWithRewards: Story = {
  args: {
    ...commonProps,
    rewardGroups: {
      coins: [...coinRewards, ...extraRewards],
    },
    variant: 'wide',
  },
};

export const WideWithLongTitle: Story = {
  args: {
    ...commonProps,
    title:
      'This is a very long title that should not be truncated in the wide view, allowing for more space to display the full title without breaking the layout',
    variant: 'wide',
  },
};

export const Loading: Story = {
  args: {
    ...commonProps,
    variant: 'compact',
    isLoading: true,
  },
};
