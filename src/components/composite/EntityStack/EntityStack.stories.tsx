import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EntityStack } from './EntityStack';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { mockPortfolioTokens, mockProtocols } from './fixtures';

const meta = {
  title: 'components/composite/EntityStack',
  component: EntityStack,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: Object.values(AvatarSize),
    },
  },
} satisfies Meta<typeof EntityStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = {
  args: {
    entities: [
      mockPortfolioTokens.eth,
      mockPortfolioTokens.usdc,
      mockPortfolioTokens.wbtc,
    ],
    size: AvatarSize.MD,
    spacing: -1.5,
  },
};

export const Protocols: Story = {
  args: {
    entities: [mockProtocols.aave, mockProtocols.uniswap],
    size: AvatarSize.LG,
    spacing: -1.5,
  },
};

export const WithLimit: Story = {
  args: {
    entities: [
      mockPortfolioTokens.eth,
      mockPortfolioTokens.usdc,
      mockPortfolioTokens.wbtc,
      mockPortfolioTokens.dai,
    ],
    size: AvatarSize.MD,
    limit: 2,
  },
};

export const Vertical: Story = {
  args: {
    entities: [mockPortfolioTokens.eth, mockPortfolioTokens.usdc],
    size: AvatarSize.SM,
    direction: 'column',
    spacing: -1,
  },
};

export const LargeStack: Story = {
  args: {
    entities: [
      mockPortfolioTokens.eth,
      mockPortfolioTokens.usdc,
      mockPortfolioTokens.wbtc,
    ],
    size: AvatarSize.XL,
    spacing: -2,
  },
};
