import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { action } from 'storybook/actions';

import { TaskInput } from './TaskInput';

const meta = {
  component: TaskInput,
  args: {
    onChange: action('on-change'),
    onFocus: action('on-focus'),
    onBlur: action('on-blur'),
  },
} satisfies Meta<typeof TaskInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
  },
};

export const Filled: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
    value: '0x3403-4234-4324-1492',
  },
};

export const Disabled: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
    disabled: true,
  },
};

export const Active: Story = {
  args: {
    id: 'proposal-id',
    name: 'proposal-id',
    placeholder: 'Enter proposal ID...',
  },
  parameters: {
    pseudo: { hover: true },
  },
};
