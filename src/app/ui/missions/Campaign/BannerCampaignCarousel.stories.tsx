import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { CarouselShell } from './CarouselShell';
import { InfoCard } from './InfoCard';
import { ChainStack } from './ChainStack';
import { InfoCardVariant } from './BannerCarousel.style';
import { BannerCampaignContent } from './BannerCampaignContent';
import { BannerCampaignSkeleton } from './BannerCampaignSkeleton';

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
    isDefaultInfoCard: true,
  },
  {
    bannerImage:
      'https://strapi.jumper.exchange/uploads/Lens_Grow_With_Lens_Campaign_Image1_060625_55d2006136.png',
    bannerTitle: 'Campaign B',
    title: 'Campaign B',
    benefitLabel: 'Bonus Pool',
    benefitValue: '$200K',
    missionsCount: 8,
    isDefaultInfoCard: false,
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
    isDefaultInfoCard: true,
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
            <InfoCard
              title={campaign.benefitLabel}
              description={campaign.benefitValue}
              variant={
                campaign.isDefaultInfoCard
                  ? InfoCardVariant.Default
                  : InfoCardVariant.Inverted
              }
            />
          )}
          {!!campaign.missionsCount && (
            <InfoCard
              title="Missions"
              description={campaign.missionsCount.toString()}
              variant={
                campaign.isDefaultInfoCard
                  ? InfoCardVariant.Default
                  : InfoCardVariant.Inverted
              }
            />
          )}
          {!!campaign.rewardChainIds?.length && (
            <InfoCard
              title="Rewards"
              description={<ChainStack chainIds={campaign.rewardChainIds} />}
              variant={
                campaign.isDefaultInfoCard
                  ? InfoCardVariant.Default
                  : InfoCardVariant.Inverted
              }
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
        isDefaultInfoCard: true,
      },
    ],
  },
};
