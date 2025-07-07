import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './Badge';
import { BadgeVariant, BadgeSize } from './Badge.styles';

const meta = {
  component: Badge,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(BadgeVariant),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(BadgeSize),
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Badge',
  },
};
