import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { CarouselShell } from './CarouselShell';
import { BannerCampaignContent } from './BannerCampaignContent';
import { BannerCampaignSkeleton } from './BannerCampaignSkeleton';
import { ChainStack } from 'src/components/composite/ChainStack/ChainStack';
import { MissionHeroStatsCard } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard';
import { MissionHeroStatsCardVariant } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard.style';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';

const meta: Meta<typeof CarouselShell> = {
  title: 'Components/Carousel/Mission campaign carousel',
  component: CarouselShell,
  tags: ['autodocs'],
};

export default meta;

// Storybook mocked data
const defaultCampaigns = [
  {
    bannerImage:
      'https://strapi.jumper.exchange/uploads/lisksurgebig_456c82d828.png',
    bannerTitle: 'Campaign A',
    title: 'Campaign A',
    benefitLabel: 'Total Rewards',
    benefitValue: '$100K',
    missionsCount: 5,
    rewardChainIds: ['1', '10'],
    slug: 'campaign-a',
    heroStatsCardVariant: MissionHeroStatsCardVariant.Default,
  },
  {
    bannerImage:
      'https://strapi.jumper.exchange/uploads/Lens_Grow_With_Lens_Campaign_Image1_060625_55d2006136.png',
    bannerTitle: 'Campaign B',
    title: 'Campaign B',
    benefitLabel: 'Bonus Pool',
    benefitValue: '$200K',
    missionsCount: 8,
    heroStatsCardVariant: MissionHeroStatsCardVariant.Inverted,
    rewardChainIds: ['42161'],
    slug: 'campaign-b',
  },
  {
    bannerImage:
      'https://strapi.jumper.exchange/uploads/lisksurgebig_456c82d828.png',
    bannerTitle: 'Campaign C',
    title: 'Campaign C',
    missionsCount: 3,
    rewardChainIds: ['10', '137', '8453'],
    slug: 'campaign-c',
    heroStatsCardVariant: MissionHeroStatsCardVariant.Default,
  },
];

// These are used only the in stories, but not component
type CustomStoryArgs = {
  campaigns?: typeof defaultCampaigns;
  isLoading?: boolean;
};

type Story = StoryObj<typeof CarouselShell> & {
  args?: CustomStoryArgs;
};

// For presentation purposes only — this custom template allows us to display components without relying on hooks for data manipulation
// Renders the carousel with optional prop overrides
const Template: StoryFn<typeof CarouselShell> = (_props, { args }) => {
  const { campaigns = defaultCampaigns, isLoading } = args as CustomStoryArgs;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  if (isLoading) {
    return <BannerCampaignSkeleton />;
  }

  return (
    <CarouselShell>
      {campaigns.map((campaign) => (
        <BannerCampaignContent
          key={campaign.slug}
          imageSrc={campaign.bannerImage}
          alt={`${campaign.bannerTitle || campaign.title} banner`}
        >
          {!!campaign.benefitLabel && !!campaign.benefitValue && (
            <MissionHeroStatsCard
              title={campaign.benefitLabel}
              description={campaign.benefitValue}
              variant={campaign.heroStatsCardVariant}
            />
          )}
          {!!campaign.missionsCount && (
            <MissionHeroStatsCard
              title="Missions"
              description={campaign.missionsCount.toString()}
              variant={campaign.heroStatsCardVariant}
            />
          )}
          {!!campaign.rewardChainIds?.length && (
            <MissionHeroStatsCard
              title="Rewards"
              description={
                <ChainStack
                  chainIds={campaign.rewardChainIds}
                  size={isMobile ? AvatarSize.XS : AvatarSize.MD}
                />
              }
              variant={campaign.heroStatsCardVariant}
            />
          )}
        </BannerCampaignContent>
      ))}
    </CarouselShell>
  );
};

export const Default: Story = {
  render: Template,
};

export const Loading: Story = {
  render: Template,
  args: {
    isLoading: true,
  },
};

export const CustomCampaigns: Story = {
  render: Template,
  args: {
    campaigns: [
      {
        bannerImage:
          'https://strapi.jumper.exchange/uploads/lisksurgebig_456c82d828.png',
        title: 'Custom Campaign',
        bannerTitle: 'Custom Campaign',
        benefitLabel: 'Airdrop',
        benefitValue: '$5K',
        missionsCount: 2,
        rewardChainIds: ['56'],
        slug: 'custom-campaign',
        heroStatsCardVariant: MissionHeroStatsCardVariant.Default,
      },
    ],
  },
};
