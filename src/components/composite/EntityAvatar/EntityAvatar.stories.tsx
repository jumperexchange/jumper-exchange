import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EntityAvatar } from './EntityAvatar';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { mockPortfolioTokens, mockProtocols } from './fixtures';

const meta = {
  title: 'components/composite/EntityAvatar',
  component: EntityAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: Object.values(AvatarSize),
    },
  },
} satisfies Meta<typeof EntityAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Token: Story = {
  args: {
    entity: mockPortfolioTokens.eth,
    size: AvatarSize.LG,
  },
};

export const Protocol: Story = {
  args: {
    entity: mockProtocols.aave,
    size: AvatarSize.LG,
  },
};

export const Small: Story = {
  args: {
    entity: mockPortfolioTokens.usdc,
    size: AvatarSize.SM,
  },
};

export const ExtraLarge: Story = {
  args: {
    entity: mockPortfolioTokens.wbtc,
    size: AvatarSize.XXL,
  },
};
