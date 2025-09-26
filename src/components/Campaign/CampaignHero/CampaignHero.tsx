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
import { ChainStack } from 'src/components/composite/ChainStack/ChainStack';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppPaths } from 'src/const/urls';
import { ICON_SIZES } from './constants';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';

interface CampaignHeroProps {
  campaign: CampaignData;
}

export const CampaignHero: FC<CampaignHeroProps> = ({ campaign }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const {
    title,
    description,
    background,
    icon,
    benefitLabel,
    benefitValue,
    rewardChainIds,
    missionsCount,
    heroStatsCardVariant,
  } = useCampaignDisplayData(campaign);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(AppPaths.Missions);
    }
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
            data-testid="campaign-back-button"
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
              width={
                isMobile ? ICON_SIZES.MOBILE.WIDTH : ICON_SIZES.DESKTOP.WIDTH
              }
              height={
                isMobile ? ICON_SIZES.MOBILE.HEIGHT : ICON_SIZES.DESKTOP.HEIGHT
              }
              style={{ objectFit: 'contain', borderRadius: '50%' }}
              variant={heroStatsCardVariant}
            />
          )}

          <CampaignHeroStatsWrapper>
            {!!benefitLabel && !!benefitValue && (
              <MissionHeroStatsCard
                title={benefitLabel ?? t('campaign.stats.totalRewards')}
                description={benefitValue}
                variant={heroStatsCardVariant}
              />
            )}
            {!!missionsCount && (
              <MissionHeroStatsCard
                title={t('campaign.stats.missions')}
                description={missionsCount.toString()}
                variant={heroStatsCardVariant}
              />
            )}
            {!!rewardChainIds?.length && (
              <MissionHeroStatsCard
                title={t('campaign.stats.rewards')}
                description={
                  <ChainStack
                    chainIds={rewardChainIds}
                    size={isMobile ? AvatarSize.XS : AvatarSize.MD}
                  />
                }
                variant={heroStatsCardVariant}
              />
            )}
          </CampaignHeroStatsWrapper>
        </CampaignHeroCard>
      </CampaignHeroContainer>
    </SectionCardContainer>
  );
};
