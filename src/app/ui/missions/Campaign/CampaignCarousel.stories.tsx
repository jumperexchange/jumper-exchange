import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { CampaignCarousel } from './CampaignCarousel';
import { Campaign } from './Campaign';
import { CampaignInfoCard } from './CampaignInfoCard';
import { ChainStack } from './ChainStack';
import { InfoCardVariant } from './Campaign.style';

const meta: Meta<typeof CampaignCarousel> = {
  title: 'Components/Carousel/Mission campaign carousel',
  component: CampaignCarousel,
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
};

// Render template with overrides
const Template: StoryFn<typeof CampaignCarousel> = (_props, { args }) => {
  const { campaigns = defaultCampaigns } = args as CustomStoryArgs;

  return (
    <CampaignCarousel>
      {campaigns.map((campaign) => (
        <Campaign
          key={campaign.slug}
          imageSrc={campaign.bannerImage}
          alt={`${campaign.bannerTitle || campaign.title} banner`}
        >
          {!!campaign.benefitLabel && !!campaign.benefitValue && (
            <CampaignInfoCard
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
            <CampaignInfoCard
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
            <CampaignInfoCard
              title="Rewards"
              description={<ChainStack chainIds={campaign.rewardChainIds} />}
              variant={
                campaign.isDefaultInfoCard
                  ? InfoCardVariant.Default
                  : InfoCardVariant.Inverted
              }
            />
          )}
        </Campaign>
      ))}
    </CampaignCarousel>
  );
};

export const Default: StoryObj<typeof CampaignCarousel> = {
  render: Template,
};

export const CustomCampaigns: StoryObj<typeof CampaignCarousel> = {
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
  } as any,
};
