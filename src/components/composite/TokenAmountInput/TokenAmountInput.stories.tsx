import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TokenAmountInput } from './TokenAmountInput';
import { tokenBalance } from './fixtures';
import { SelectCardMode } from '@/components/Cards/SelectCard/SelectCard.styles';
import { TokenAmountInputPercentages } from './adornments/TokenAmountInputPercentages';

const meta: Meta<typeof TokenAmountInput> = {
  title: 'components/composite/TokenAmountInput',
  component: TokenAmountInput,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokenBalance,
    mode: SelectCardMode.Input,
  },
};

export const WithSwapBetweenPriceAmount: Story = {
  args: {
    tokenBalance,
    mode: SelectCardMode.Input,
    enableSwapButton: true,
  },
};

export const WithResetButton: Story = {
  args: {
    tokenBalance,
    mode: SelectCardMode.Input,
    enableResetButton: true,
  },
};

export const WithMaxBalanceDisplay: Story = {
  args: {
    tokenBalance,
    mode: SelectCardMode.Input,
    hintEndAdornment: `/ 1234.34`,
  },
};

// Disabling this for the moment as it seems storybook and MuiCard-root hovering effect do not play well together
// export const WithPercentages: Story = {
//   args: {
//     tokenBalance,
//     mode: SelectCardMode.Input,
//     hintEndAdornment: `/ 1234.34`,
//     endAdornment: (
//       <TokenAmountInputPercentages
//         maxAmount={12345n}
//         onAmountChange={() => {}}
//       />
//     ),
//   },
// };

export const TokenAmountDisplay: Story = {
  args: {
    tokenBalance,
    mode: SelectCardMode.Display,
  },
};
