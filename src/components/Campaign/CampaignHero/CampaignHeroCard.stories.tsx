import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs-vite';
import { ComponentProps } from 'react';

import { CampaignHeroCard } from './CampaignHeroCard';
import { CampaignHeroCardSkeleton } from './CampaignHeroCardSkeletion';
import { MissionHeroStatsCard } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard';
import { MissionHeroStatsCardVariant } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard.style';
import { ChainStack } from 'src/components/ChainStack/ChainStack';
import {
  CampaignHeroCardIcon,
  CampaignHeroStatsWrapper,
} from './CampaignHero.style';
import { ChainAvatarSize } from 'src/components/ChainStack/ChainStack.style';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ICON_SIZES } from './constants';

type CampaignHeroCardStoryProps = ComponentProps<typeof CampaignHeroCard> & {
  heroStatsCardVariant?: MissionHeroStatsCardVariant;
};

const meta = {
  component: CampaignHeroCard,
  title: 'Campaigns/Hero Card',
  argTypes: {
    heroStatsCardVariant: {
      control: { type: 'select' },
      options: Object.values(MissionHeroStatsCardVariant),
    },
  },
} satisfies Meta<CampaignHeroCardStoryProps>;

export default meta;
type CustomStoryArgs = {
  isLoading?: boolean;
  icon?: string;
  benefitLabel?: string;
  benefitValue?: string;
  missionsCount?: number;
  rewardChainIds?: string[];
  heroStatsCardVariant?: MissionHeroStatsCardVariant;
};

type Story = StoryObj<CampaignHeroCardStoryProps> & {
  args?: CustomStoryArgs;
};

// For presentation purposes only — this custom template allows us to display components without relying on hooks for data manipulation
// Renders the campaign card with optional prop overrides
const Template: StoryFn<CampaignHeroCardStoryProps> = (_props, { args }) => {
  const {
    isLoading,
    icon,
    benefitLabel,
    benefitValue,
    missionsCount,
    rewardChainIds,
    heroStatsCardVariant,
  } = args as CustomStoryArgs;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  if (isLoading) {
    return <CampaignHeroCardSkeleton />;
  }

  return (
    <CampaignHeroCard {...args}>
      {icon && (
        <CampaignHeroCardIcon
          src={icon}
          alt={`${args.title} campaign icon`}
          width={isMobile ? ICON_SIZES.MOBILE.WIDTH : ICON_SIZES.DESKTOP.WIDTH}
          height={
            isMobile ? ICON_SIZES.MOBILE.HEIGHT : ICON_SIZES.DESKTOP.HEIGHT
          }
          style={{ objectFit: 'contain', borderRadius: '50%' }}
        />
      )}

      <CampaignHeroStatsWrapper>
        {!!benefitLabel && !!benefitValue && (
          <MissionHeroStatsCard
            title={benefitLabel}
            description={benefitValue}
            variant={heroStatsCardVariant}
          />
        )}
        {!!missionsCount && (
          <MissionHeroStatsCard
            title="Missions"
            description={missionsCount}
            variant={heroStatsCardVariant}
          />
        )}
        {!!rewardChainIds?.length && (
          <MissionHeroStatsCard
            title="Rewards"
            description={
              <ChainStack
                chainIds={rewardChainIds}
                size={isMobile ? ChainAvatarSize.XS : ChainAvatarSize.MD}
              />
            }
            variant={heroStatsCardVariant}
          />
        )}
      </CampaignHeroStatsWrapper>
    </CampaignHeroCard>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    title: 'Pre-mine on Berachain',
    description:
      'Jumper and Berachain DAO are hosting Lisk Surge, a 9-week DeFi Campaign with above market yields opportunities for key assets including USDT0, ETH and BTC.',
    imageSrc:
      'https://strapi.jumper.exchange/uploads/Surge_Banner_2880x720_1_f24f7490bc.png',
    alt: 'Pre-mine on Berachain',
    icon: 'https://strapi.jumper.exchange/uploads/lisk_chain_de4347a5f9.png',
    benefitLabel: 'Total Rewards',
    benefitValue: '$100K',
    missionsCount: 5,
    rewardChainIds: ['1', '10'],
    heroStatsCardVariant: MissionHeroStatsCardVariant.Default,
  },
};
