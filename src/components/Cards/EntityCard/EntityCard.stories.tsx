import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EntityCard } from './EntityCard';
import { Badge } from '@/components/Badge/Badge';

const meta: Meta<typeof EntityCard> = {
  title: 'Components/Cards/Mission cards',
  component: EntityCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EntityCard>;

const commonProps = {
  id: 'example-card',
  slug: 'example-entity-card',
  title:
    'Example Entity Card That has an extremely long title that should be truncated',
  description: 'This is an example of an entity card.',
  imageUrl:
    'https://strapi.jumper.exchange/uploads/AI_Memecoins_and_Crypto_f98c61b932.png',
  participants: [
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
  ],
  rewardGroups: {
    apy: [
      {
        value: '4.7%',
        label: 'APY',
      },
    ],
    xp: [
      {
        value: '25',
        label: 'XP',
      },
    ],
    coins: [
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
    ],
  },
  partnerLink: {
    url: 'https://jumper.exchange',
    label: 'Visit Jumper Exchange',
  },
  onClick: () => console.log('Entity Card Clicked'),
  badge: <Badge label="Active" />,
};

export const Compact: Story = {
  args: {
    ...commonProps,
    type: 'compact',
  },
};

export const Wide: Story = {
  args: {
    ...commonProps,
    type: 'wide',
  },
};

export const Loading: Story = {
  args: {
    ...commonProps,
    type: 'compact',
    isLoading: true,
  },
};
