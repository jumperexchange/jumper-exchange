import type { Meta, StoryFn, StoryObj } from '@storybook/nextjs-vite';

import { CampaignHeroCard } from './CampaignHeroCard';
import { CampaignHeroCardSkeleton } from './CampaignHeroCardSkeletion';
import { MissionHeroStatsCard } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard';
import { MissionHeroStatsCardVariant } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard.style';
import { ChainStack } from 'src/components/ChainStack/ChainStack';
import {
  CampaignHeroCardIcon,
  CampaignHeroStatsWrapper,
} from './CampaignHero.style';

const meta = {
  component: CampaignHeroCard,
  title: 'Campaigns/Hero Card',
} satisfies Meta<typeof CampaignHeroCard>;

export default meta;
type CustomStoryArgs = {
  isLoading?: boolean;
  icon?: string;
  benefitLabel?: string;
  benefitValue?: string;
  missionsCount?: number;
  rewardChainIds?: string[];
};

type Story = StoryObj<typeof CampaignHeroCard> & {
  args?: CustomStoryArgs;
};

// For presentation purposes only — this custom template allows us to display components without relying on hooks for data manipulation
// Renders the campaign card with optional prop overrides
const Template: StoryFn<typeof CampaignHeroCard> = (_props, { args }) => {
  const {
    isLoading,
    icon,
    benefitLabel,
    benefitValue,
    missionsCount,
    rewardChainIds,
  } = args as CustomStoryArgs;

  if (isLoading) {
    return <CampaignHeroCardSkeleton />;
  }

  return (
    <CampaignHeroCard {...args}>
      {icon && (
        <CampaignHeroCardIcon
          src={icon}
          alt={`${args.title} campaign icon`}
          width={112}
          height={112}
          style={{ objectFit: 'contain', borderRadius: '50%' }}
        />
      )}

      <CampaignHeroStatsWrapper>
        {!!benefitLabel && !!benefitValue && (
          <MissionHeroStatsCard
            title={benefitLabel}
            description={benefitValue}
            variant={MissionHeroStatsCardVariant.Default}
          />
        )}
        {!!missionsCount && (
          <MissionHeroStatsCard
            title="Missions"
            description={missionsCount}
            variant={MissionHeroStatsCardVariant.Default}
          />
        )}
        {!!rewardChainIds?.length && (
          <MissionHeroStatsCard
            title="Rewards"
            description={<ChainStack chainIds={rewardChainIds} />}
            variant={MissionHeroStatsCardVariant.Default}
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
  },
};
