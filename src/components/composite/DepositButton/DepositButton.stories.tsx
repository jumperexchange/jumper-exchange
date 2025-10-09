import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DepositButton } from './DepositButton';
import { action } from 'storybook/internal/actions';
import { DepositButtonDisplayMode } from './DepositButton.types';

const meta = {
  component: DepositButton,
  title: 'Composite/Deposit Button',
  args: {
    onClick: action('on-click'),
  },
  argTypes: {
    displayMode: {
      control: { type: 'select' },
      options: Object.values(DepositButtonDisplayMode),
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof DepositButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    displayMode: DepositButtonDisplayMode.IconAndLabel,
    label: 'Quick deposit',
  },
};

export const IconOnly: Story = {
  args: {
    displayMode: DepositButtonDisplayMode.IconOnly,
  },
};

export const LabelOnly: Story = {
  args: {
    displayMode: DepositButtonDisplayMode.LabelOnly,
    label: 'Quick deposit',
  },
};
