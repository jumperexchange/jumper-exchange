import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { commonArgs, compactPrimaryAction } from './fixtures';
import { TopEarnCard, TopEarnCardCopyKey } from './variants/TopEarnCard';

const meta = {
  component: TopEarnCard,
  title: 'Earn/TopEarnCard',
  argTypes: {
    primaryAction: {
      control: false,
    },
  },
} satisfies Meta<typeof TopEarnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    ...commonArgs,
  },
};

export const TopLoading: Story = {
  args: {
    ...commonArgs,
    isLoading: true,
  },
};

export const TopWithAction: Story = {
  args: {
    ...commonArgs,
    primaryAction: compactPrimaryAction,
  },
};

export const TopWithActionAndNoRecommendation: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    primaryAction: compactPrimaryAction,
  },
};

export const TopWithActionAndNoRecommendationAndMain: Story = {
  args: {
    ...commonArgs,
    primaryAction: compactPrimaryAction,
    isMain: true,
  },
};

export const TopWithActionAndNoRecommendationAndCustomCopy: Story = {
  args: {
    ...commonArgs,
    primaryAction: compactPrimaryAction,
    copy: TopEarnCardCopyKey.MAXIMIZE_YOUR_REVENUE,
    isMain: true,
  },
};
