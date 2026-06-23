import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import {
  ApyWindowOptions,
  EarnApyWindowToggle,
} from './EarnApyWindowToggle';
import type { ApyWindow } from './EarnApyWindowToggle';

const meta = {
  component: EarnApyWindowToggle,
  title: 'Earn/FilterBar/ApyWindowToggle',
  args: {
    onChange: () => {},
  },
  argTypes: {
    value: {
      control: { type: 'radio' },
      options: Object.values(ApyWindowOptions),
    },
    onChange: { action: 'onChange' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof EarnApyWindowToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: ApyWindowOptions.SEVEN_DAY,
  },
};

export const ThirtyDaySelected: Story = {
  args: {
    value: ApyWindowOptions.THIRTY_DAY,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [window, setWindow] = useState<ApyWindow>(ApyWindowOptions.SEVEN_DAY);
    return (
      <EarnApyWindowToggle {...args} value={window} onChange={setWindow} />
    );
  },
  args: {
    value: ApyWindowOptions.SEVEN_DAY,
  },
};

export const Disabled: Story = {
  args: {
    value: ApyWindowOptions.SEVEN_DAY,
    disabled: true,
  },
};
