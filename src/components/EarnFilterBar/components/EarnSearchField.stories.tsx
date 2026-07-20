import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { EarnSearchField } from './EarnSearchField';

const meta = {
  component: EarnSearchField,
  title: 'Earn/SearchField',
} satisfies Meta<typeof EarnSearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveEarnSearchField = ({
  initialValue = '',
}: {
  initialValue?: string;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <EarnSearchField
      value={value}
      onChange={(next) => {
        setValue(next);
        action('on-change')(next);
      }}
      onClear={() => {
        setValue('');
        action('on-clear')();
      }}
    />
  );
};

const noop = () => {};

export const Empty: Story = {
  args: { value: '', onChange: noop, onClear: noop },
  render: () => <InteractiveEarnSearchField />,
};

export const WithValue: Story = {
  args: { value: 'Steakhouse USDC', onChange: noop, onClear: noop },
  render: () => <InteractiveEarnSearchField initialValue="Steakhouse USDC" />,
};
