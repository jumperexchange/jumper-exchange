import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { commonArgs } from '../fixtures';
import { OverviewEarnCard } from './OverviewEarnCard';

const meta = {
  component: OverviewEarnCard,
  title: 'Earn/OverviewEarnCard',
} satisfies Meta<typeof OverviewEarnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...commonArgs,
  },
};

export const CapacityCapped: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      capacity: {
        remaining: '5000000000',
        max: '10000000000',
      },
    },
  },
};

export const CapacityUnlimited: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      capacity: {
        unlimited: true,
      },
    },
  },
};

export const CapacityUnknown: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      capacity: undefined,
    },
  },
};

export const WithFees: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      fees: {
        performance: 0.02,
        management: 0.01,
      },
    },
  },
};

export const AllFeesPresent: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      fees: {
        performance: 0.2,
        management: 0.02,
        withdrawal: 0.001,
        deposit: 0.0005,
      },
    },
  },
};

export const NoFees: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      fees: undefined,
    },
  },
};

export const CapacityAndFees: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      capacity: {
        remaining: '3000000000',
        max: '10000000000',
      },
      fees: {
        performance: 0.1,
        management: 0.02,
      },
    },
  },
};
