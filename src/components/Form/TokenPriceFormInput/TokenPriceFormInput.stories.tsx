import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TokenPriceFormInput } from './TokenPriceFormInput';
import { tokenBalance } from './fixtures';

const meta = {
  component: TokenPriceFormInput,
} satisfies Meta<typeof TokenPriceFormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'token-price-field',
    name: 'token-price-field',
    tokenBalance,
    onAmountChange: (amount, amountUSD) => {
      console.log(
        `onAmountChange called with amount ${amount} and amountUSD ${amountUSD}`,
      );
    },
  },
};
