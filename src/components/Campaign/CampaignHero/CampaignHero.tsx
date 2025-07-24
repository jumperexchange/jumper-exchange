'use client';

import { FC } from 'react';
import { CampaignData } from 'src/types/strapi';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { Badge } from 'src/components/Badge/Badge';
import {
  CampaignHeroCardIcon,
  CampaignHeroContainer,
  CampaignHeroStatsWrapper,
} from './CampaignHero.style';
import { useCampaignDisplayData } from 'src/hooks/campaigns/useCampaignDisplayData';
import { CampaignHeroCard } from './CampaignHeroCard';
import { MissionHeroStatsCard } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard';
import { ChainStack } from 'src/components/ChainStack/ChainStack';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

interface CampaignHeroProps {
  campaign: CampaignData;
}

export const CampaignHero: FC<CampaignHeroProps> = ({ campaign }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    title,
    description,
    background,
    icon,
    benefitLabel,
    benefitValue,
    rewardChainIds,
    missionsCount,
    statsCardVariant,
  } = useCampaignDisplayData(campaign);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SectionCardContainer>
      <CampaignHeroContainer>
        <Box sx={{ width: '100%' }}>
          <Badge
            label={t('navbar.links.back')}
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            size={BadgeSize.LG}
            variant={BadgeVariant.Alpha}
          />
        </Box>
        <CampaignHeroCard
          title={title}
          description={description}
          imageSrc={background}
          alt={`${title} campaign background`}
        >
          {icon && (
            <CampaignHeroCardIcon
              src={icon}
              alt={`${title} campaign icon`}
              width={112}
              height={112}
              style={{ objectFit: 'contain', borderRadius: '50%' }}
            />
          )}

          <CampaignHeroStatsWrapper>
            {!!benefitLabel && !!benefitValue && (
              <MissionHeroStatsCard
                title={benefitLabel ?? t('campaign.stats.totalRewards')}
                description={benefitValue}
                variant={statsCardVariant}
              />
            )}
            {!!missionsCount && (
              <MissionHeroStatsCard
                title={t('campaign.stats.missions')}
                description={missionsCount.toString()}
                variant={statsCardVariant}
              />
            )}
            {!!rewardChainIds?.length && (
              <MissionHeroStatsCard
                title={t('campaign.stats.rewards')}
                description={<ChainStack chainIds={rewardChainIds} />}
                variant={statsCardVariant}
              />
            )}
          </CampaignHeroStatsWrapper>
        </CampaignHeroCard>
      </CampaignHeroContainer>
    </SectionCardContainer>
  );
};
