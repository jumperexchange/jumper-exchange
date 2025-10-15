import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EarnCard } from './EarnCard';
import {
  commonArgs,
  compactPrimaryAction,
  listItemPrimaryAction,
} from './fixtures';
import { AppPaths } from 'src/const/urls';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';

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

export const CompactWithHref: Story = {
  args: {
    ...commonArgs,
    variant: 'compact',
    href: `${AppPaths.Earn}/${commonArgs.data.slug}`,
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

export const ListItemWithHref: Story = {
  args: {
    ...commonArgs,
    variant: 'list-item',
    href: `${AppPaths.Earn}/${commonArgs.data.slug}`,
  },
};

export const Overview: Story = {
  args: {
    ...commonArgs,
    variant: 'overview',
  },
};

export const OverviewLoading: Story = {
  args: {
    ...commonArgs,
    variant: 'overview',
    isLoading: true,
  },
};

export const OvervieWithBadge: Story = {
  args: {
    ...commonArgs,
    variant: 'overview',
    headerBadge: (
      <Badge
        variant={BadgeVariant.Secondary}
        size={BadgeSize.SM}
        label="Updated 12 hours ago"
      />
    ),
  },
};
