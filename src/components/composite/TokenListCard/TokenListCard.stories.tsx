import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TokenListCard } from './TokenListCard';
import { tokenMultipleChains, tokenSingleChain } from './fixtures';
import { TokenListCardTokenSize } from './TokenListCard.types';

const meta: Meta<typeof TokenListCard> = {
  title: 'Composite/TokenListCard',
  component: TokenListCard,
  argTypes: {
    size: {
      control: 'select',
      options: Object.values(TokenListCardTokenSize),
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    token: tokenMultipleChains,
  },
};

export const SingleItem: Story = {
  args: {
    token: tokenSingleChain,
  },
};
