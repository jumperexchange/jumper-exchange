import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AvatarStack } from './AvatarStack';
import { AvatarSize } from './AvatarStack.types';

const meta = {
  title: 'Components/AvatarStack',
  component: AvatarStack,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: Object.values(AvatarSize),
    },
  },
} satisfies Meta<typeof AvatarStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatars: [
      {
        id: '1',
        src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        alt: 'Avatar 1',
      },
      {
        id: '2',
        src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
        alt: 'Avatar 2',
      },
      {
        id: '3',
        src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
        alt: 'Avatar 3',
      },
    ],
    size: AvatarSize.MD,
    spacing: -1.5,
  },
};

export const Loading: Story = {
  args: {
    avatars: [
      {
        id: '1',
        src: '',
        alt: 'Avatar 1',
      },
      {
        id: '2',
        src: '',
        alt: 'Avatar 2',
      },
      {
        id: '3',
        src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
        alt: 'Avatar 3',
      },
    ],
    size: AvatarSize.MD,
    spacing: -1.5,
  },
};
