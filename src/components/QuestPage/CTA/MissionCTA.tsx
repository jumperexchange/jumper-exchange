import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  type Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { IconButtonPrimary } from 'src/components/IconButton';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { XPDisplayBox } from 'src/components/ProfilePage/QuestCard/QuestCard.style';
import { XPIconBox } from 'src/components/ProfilePage/QuestCardDetailled/QuestCard.style';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { FlexCenterRowBox } from '../QuestsMissionPage.style';
import { SignatureCTA } from '../SignatureCTA/SignatureCTA';
import {
  CTAExplanationBox,
  CTAMainBox,
  MissionCtaButtonSF,
  SeveralCTABox,
  SeveralMissionCtaContainer,
  StartedTitleBox,
  StartedTitleTypography,
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
  if (activeCampaign === 'superfest') {
    return (
      <MissionCtaButtonSF onClick={onClick}>
        <ArrowForwardIcon
          sx={{
            color: theme.palette.text.primary,
            width: '20px',
            height: '20px',
          }}
        />
      </MissionCtaButtonSF>
    );
  } else {
    return (
      <IconButtonPrimary onClick={onClick}>
        <ArrowForwardIcon sx={{ width: '28px', height: '28px' }} />
      </IconButtonPrimary>
    );
  }
};

export interface CTALinkInt {
  logo: string;
  text: string;
  link: string;
  claimingId: string;
  rewardId?: string;
  apy?: number;
  weeklyApy?: string;
}

interface MissionCtaProps {
  title?: string;
  url?: string;
  rewards?: boolean;
  id?: number;
  label?: string;
  CTAs: CTALinkInt[];
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
  // const { trackEvent } = useUserTracking();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme();
  const { trackEvent } = useUserTracking();

  const handleClick = ({
    rewardId,
    id,
    claimingId,
    activeCampaign,
    title,
  }: {
    rewardId?: string;
    id?: number;
    claimingId: string;
    activeCampaign?: string;
    title?: string;
  }) => {
    trackEvent({
      category: TrackingCategory.Missions,
      action: TrackingAction.ClickMissionCta,
      label: `click-mission-cta-${id}`,
      data: {
        [TrackingEventParameter.MissionCtaRewardId]: rewardId || '',
        [TrackingEventParameter.MissionCtaClaimingId]: claimingId || '',
        [TrackingEventParameter.MissionCtaTitle]: title || '',
        [TrackingEventParameter.MissionCtaLabel]: label || '',
        [TrackingEventParameter.MissionCtaPartnerId]: id || '',
        [TrackingEventParameter.MissionCtaCampaign]: activeCampaign || '',
      },
    });
  };

  return (
    <CTAMainBox>
      <StartedTitleBox>
        <StartedTitleTypography>Get Started</StartedTitleTypography>
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
        {CTAs.map((CTA: CTALinkInt, i: number) => {
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
                  <Image
                    src={CTA.logo}
                    alt={`Image for ${CTA.logo}`}
                    width={48}
                    height={48}
                    priority={false}
                  />
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
                  {CTA.apy && !variableWeeklyAPY && (
                    <Tooltip
                      className="tooltip-icon"
                      title={
                        'Expected extra rewards to win during the campaign for the tokens invested.'
                      }
                      placement={'top'}
                      enterTouchDelay={0}
                      arrow
                    >
                      <XPDisplayBox
                        bgcolor={theme.palette.primary.main}
                        marginRight={'16px'}
                        height={'32px'}
                        minWidth={'88px'}
                      >
                        <Typography
                          variant="bodyMediumStrong"
                          sx={(theme) => ({
                            color: theme.palette.text.primary,
                          })}
                        >
                          {`${Number(CTA.apy).toFixed(1)}%`}
                        </Typography>
                        <XPIconBox marginLeft="4px">
                          <APYIcon size={24} />
                        </XPIconBox>
                      </XPDisplayBox>
                    </Tooltip>
                  )}
                  {variableWeeklyAPY && (
                    <XPDisplayBox
                      bgcolor={'#ff0420'}
                      marginRight={'16px'}
                      height={'32px'}
                      minWidth={'88px'}
                    >
                      <Typography
                        sx={(theme) => ({
                          fontSize: '16px',
                          fontWeight: 700,
                          lineHeight: '20px',
                          color: theme.palette.white.main,
                        })}
                      >
                        {CTA?.weeklyApy
                          ? CTA?.weeklyApy
                          : rewardRange
                            ? rewardRange
                            : `VAR.%`}
                      </Typography>
                      <XPIconBox marginLeft="4px">
                        <APYIcon size={24} />
                      </XPIconBox>
                    </XPDisplayBox>
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
