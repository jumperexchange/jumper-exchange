import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EarnCard } from './EarnCard';
import {
  commonArgs,
  compactPrimaryAction,
  listItemPrimaryAction,
} from './fixtures';

const meta = {
  component: EarnCard,
  title: 'Earn/Cards',
  argTypes: {
    primaryAction: {
      control: false,
    },
  },
} satisfies Meta<typeof EarnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    primaryAction: compactPrimaryAction,
  },
};

export const CompactNoRecommendation: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    variant: 'compact',
    primaryAction: compactPrimaryAction,
  },
};

export const CompactSingleAsset: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    primaryAction: compactPrimaryAction,
  },
};

export const CompactLoading: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    isLoading: true,
  },
};

export const ListItem: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    primaryAction: listItemPrimaryAction,
  },
};

export const ListItemNoRecommendation: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    variant: 'list-item',
    primaryAction: listItemPrimaryAction,
  },
};

export const ListItemSingleAsset: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    primaryAction: listItemPrimaryAction,
  },
};

export const ListItemLoading: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    isLoading: true,
  },
};

export const Top: Story = {
  args: {
    ...commonArgs,
    variant: 'top',
  },
};

export const TopLoading: Story = {
  args: {
    ...commonArgs,
    variant: 'top',
    isLoading: true,
  },
};

export const TopWithAction: Story = {
  args: {
    ...commonArgs,
    variant: 'top',
    primaryAction: listItemPrimaryAction,
  },
};
