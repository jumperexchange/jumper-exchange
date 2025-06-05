import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  Skeleton,
  type Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { IconButtonPrimary } from 'src/components/IconButton';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { XPRewardsInfo } from 'src/components/ProfilePage/QuestCard/XPRewardsInfo';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { MerklOpportunity } from 'src/types/merkl';
import { FlexCenterRowBox } from '../QuestsMissionPage.style';
import { SignatureCTA } from '../SignatureCTA/SignatureCTA';
import {
  CTAExplanationBox,
  CTAMainBox,
  SeveralCTABox,
  SeveralMissionCtaContainer,
  StartedTitleBox,
} from './MissionCTA.style';

interface MissionCTAButtonProps {
  activeCampaign?: string;
  onClick: () => void;
}

const MissionCTAButton = ({
  activeCampaign,
  onClick,
}: MissionCTAButtonProps) => {
  const theme = useTheme();
  return (
    <IconButtonPrimary onClick={onClick}>
      <ArrowForwardIcon
        sx={{
          width: '28px',
          height: '28px',
          color: (theme.vars || theme).palette.white.main,
        }}
      />
    </IconButtonPrimary>
  );
};

interface MissionCtaProps {
  CTAs: MerklOpportunity[];
  rewards?: boolean;
  title: string;
  id: number;
  label?: string;
  variableWeeklyAPY?: boolean;
  signature?: boolean;
  rewardRange?: string;
  activeCampaign?: string;
}

export const MissionCTA = ({
  CTAs,
  rewards,
  title,
  id,
  label,
  variableWeeklyAPY,
  signature,
  rewardRange,
  activeCampaign,
}: MissionCtaProps) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const { t } = useTranslation();

  const handleClick = ({
    rewardId,
    id,
    claimingId,
    activeCampaign,
    title,
  }: {
    id: number;
    title: string;
    activeCampaign?: string;
    claimingId?: string;
    rewardId?: string;
  }) => {
    trackEvent({
      category: TrackingCategory.Missions,
      action: TrackingAction.ClickMissionCta,
      label: `click-mission-cta-${id}`,
      data: {
        [TrackingEventParameter.MissionCtaTitle]: title,
        [TrackingEventParameter.MissionCtaPartnerId]: id,
        ...(rewardId && {
          [TrackingEventParameter.MissionCtaRewardId]: rewardId,
        }),
        ...(claimingId && {
          [TrackingEventParameter.MissionCtaClaimingId]: claimingId,
        }),
        ...(label && { [TrackingEventParameter.MissionCtaLabel]: label }),
        ...(activeCampaign && {
          [TrackingEventParameter.MissionCtaCampaign]: activeCampaign || '',
        }),
      },
    });
  };

  return (
    <CTAMainBox>
      <StartedTitleBox>
        <Typography
          variant="titleMedium"
          sx={{
            typography: {
              xs: theme.typography.titleSmall,
              sm: theme.typography.titleMedium,
            },
          }}
        >
          Get Started
        </Typography>
        {!signature && rewards ? (
          <Box marginTop="32px">
            <Typography
              fontSize={{ xs: '14px', md: '18px' }}
              lineHeight={{ xs: '14px', md: '18px' }}
              fontWeight={400}
            >
              Completing any mission below makes you eligible for rewards and
              XP.
            </Typography>
          </Box>
        ) : undefined}
      </StartedTitleBox>
      <SeveralCTABox>
        {signature && <SignatureCTA />}
        {CTAs.map((CTA: MerklOpportunity, i: number) => {
          return (
            <Link
              key={`cta-mission-${i}`}
              style={{
                textDecoration: 'none',
                width: '100%',
                color: 'inherit',
                marginBottom: '16px',
              }}
              href={CTA.link || '/'}
              target="_blank"
            >
              <SeveralMissionCtaContainer
                onClick={() =>
                  handleClick({
                    id,
                    rewardId: CTA.rewardId,
                    claimingId: CTA.claimingId,
                    title: CTA.text,
                  })
                }
              >
                <CTAExplanationBox>
                  {CTA.logo ? (
                    <Image
                      src={CTA.logo}
                      alt={`Image for ${CTA.logo}`}
                      width={48}
                      height={48}
                      priority={false}
                    />
                  ) : (
                    <Skeleton variant="circular" width={48} height={48} />
                  )}
                  <Typography
                    marginTop={{ xs: '16px', md: '0px' }}
                    fontSize={{ xs: '16px', sm: '22px' }}
                    fontWeight={700}
                    marginLeft={'16px'}
                  >
                    {CTA.text ?? 'Go to Protocol Page'}
                  </Typography>
                </CTAExplanationBox>
                <FlexCenterRowBox>
                  {!!CTA.apy && !variableWeeklyAPY && (
                    <XPRewardsInfo
                      variant="apy"
                      label={`${Number(CTA.apy).toFixed(1)}%`}
                      tooltip={t('tooltips.apy')}
                    >
                      <APYIcon size={24} />
                    </XPRewardsInfo>
                  )}
                  {!!variableWeeklyAPY && (
                    <XPRewardsInfo
                      variant="variableWeeklyAPY"
                      label={
                        CTA?.weeklyApy
                          ? CTA?.weeklyApy
                          : rewardRange
                            ? rewardRange
                            : `VAR.%`
                      }
                    >
                      <APYIcon size={24} />
                    </XPRewardsInfo>
                  )}
                  {!isMobile && (
                    <MissionCTAButton
                      onClick={() =>
                        handleClick({
                          id,
                          title,
                          claimingId: CTA.claimingId,
                          rewardId: CTA.rewardId,
                        })
                      }
                      activeCampaign={activeCampaign}
                    />
                  )}
                </FlexCenterRowBox>
              </SeveralMissionCtaContainer>
            </Link>
          );
        })}
      </SeveralCTABox>
    </CTAMainBox>
  );
};
