import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { commonArgs, compactPrimaryAction } from './fixtures';
import { HeroEarnCard, EarnHeroCardCopyKey } from './variants/HeroEarnCard';

const meta = {
  component: HeroEarnCard,
  title: 'Earn/HeroEarnCard',
  argTypes: {
    primaryAction: {
      control: false,
    },
  },
} satisfies Meta<typeof HeroEarnCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    ...commonArgs,
  },
};

export const HeroLoading: Story = {
  args: {
    ...commonArgs,
    isLoading: true,
  },
};

export const HeroWithAction: Story = {
  args: {
    ...commonArgs,
    primaryAction: compactPrimaryAction,
  },
};

export const HeroWithActionAndNoRecommendation: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    primaryAction: compactPrimaryAction,
  },
};

export const HeroWithActionAndNoRecommendationAndMain: Story = {
  args: {
    ...commonArgs,
    primaryAction: compactPrimaryAction,
    isMain: true,
  },
};

export const HeroWithActionAndNoRecommendationAndCustomCopy: Story = {
  args: {
    ...commonArgs,
    primaryAction: compactPrimaryAction,
    copy: EarnHeroCardCopyKey.MAXIMIZE_YOUR_REVENUE,
    isMain: true,
  },
};
