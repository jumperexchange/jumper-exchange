import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { commonArgs, heroEarnCardPrimaryAction } from './fixtures';
import { HeroEarnCard, EarnHeroCardCopyKey } from './HeroEarnCard';

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
    primaryAction: heroEarnCardPrimaryAction,
  },
};

export const HeroWithActionAndNoRecommendation: Story = {
  args: {
    ...commonArgs,
    data: {
      ...commonArgs.data,
      forYou: false,
    },
    primaryAction: heroEarnCardPrimaryAction,
  },
};

export const HeroWithActionAndNoRecommendationAndMain: Story = {
  args: {
    ...commonArgs,
    primaryAction: heroEarnCardPrimaryAction,
    isMain: true,
  },
};

export const HeroWithActionAndNoRecommendationAndCustomCopy: Story = {
  args: {
    ...commonArgs,
    primaryAction: heroEarnCardPrimaryAction,
    copy: EarnHeroCardCopyKey.MAXIMIZE_YOUR_REVENUE,
    isMain: true,
  },
};
