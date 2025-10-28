import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AvatarStack } from './AvatarStack';
import { AvatarSize } from './AvatarStack.types';
import { baseAvatars, overflowAvatars } from './fixtures';

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
    avatars: baseAvatars,
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

export const Vertical: Story = {
  args: {
    avatars: baseAvatars,
    direction: 'column',
    spacing: -1.5,
  },
};

export const WithLimit: Story = {
  args: {
    avatars: overflowAvatars,
    limit: 2,
  },
};
