import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './Badge';

const meta = {
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Badge',
  },
};
