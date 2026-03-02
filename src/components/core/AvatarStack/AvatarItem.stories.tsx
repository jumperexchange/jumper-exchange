import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AvatarItem } from './AvatarItem';
import { AvatarSize } from './AvatarStack.types';
import { baseAvatars, overflowAvatars } from './fixtures';

const meta = {
  title: 'components/core/AvatarItem',
  component: AvatarItem,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: Object.values(AvatarSize),
    },
  },
} satisfies Meta<typeof AvatarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatar: baseAvatars[0],
    size: AvatarSize.MD,
    spacing: -1.5,
  },
};

export const Loading: Story = {
  args: {
    avatar: {
      id: '1',
      src: '',
      alt: 'Avatar 1',
    },
    size: AvatarSize.MD,
    spacing: -1.5,
  },
};

export const Count: Story = {
  args: {
    avatar: {
      count: 3,
    },
    size: AvatarSize.MD,
    spacing: -1.5,
  },
};
