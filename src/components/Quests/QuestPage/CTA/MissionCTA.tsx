import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  type Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { IconButtonPrimary } from 'src/components/IconButton';
import { APYIcon } from 'src/components/illustrations/APYIcon';
import { XPDisplayBox } from 'src/components/ProfilePage/QuestCard/QuestCard.style';
import { XPIconBox } from '../../QuestCard/QuestCard.style';
import { FlexCenterRowBox } from '../../QuestsMissionPage.style';
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
  platform?: string;
  onClick: () => void;
}

const MissionCTAButton = ({ platform, onClick }: MissionCTAButtonProps) => {
  const theme = useTheme();
  if (platform === 'superfest') {
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
  rewards?: number;
  id?: number;
  CTAs: CTALinkInt[];
  variableWeeklyAPY?: boolean;
  signature?: boolean;
  rewardRange?: string;
  platform?: string;
}

export const MissionCTA = ({
  CTAs,
  rewards,
  variableWeeklyAPY,
  signature,
  rewardRange,
  platform,
}: MissionCtaProps) => {
  // const { trackEvent } = useUserTracking();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme();

  const handleClick = () => {
    // trackEvent({
    //   category: TrackingCategory.BlogArticle,
    //   //   action: TrackingAction.ClickMissionCta,
    //   label: 'click-blog-cta',
    //   disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    //   data: {
    //     [TrackingEventParameter.ArticleTitle]: title || '',
    //     [TrackingEventParameter.ArticleID]: id || '',
    //   },
    // });
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
              <SeveralMissionCtaContainer onClick={handleClick}>
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
                    <XPDisplayBox
                      bgcolor={theme.palette.primary.main}
                      marginRight={'16px'}
                      height={'32px'}
                      minWidth={'88px'}
                    >
                      <Typography
                        fontSize="16px"
                        fontWeight={700}
                        lineHeight="20px"
                        color={'#ffffff'}
                      >
                        {`${Number(CTA.apy).toFixed(1)}%`}
                      </Typography>
                      <XPIconBox marginLeft="4px">
                        <APYIcon size={24} />
                      </XPIconBox>
                    </XPDisplayBox>
                  )}
                  {variableWeeklyAPY && (
                    <XPDisplayBox
                      bgcolor={'#ff0420'}
                      marginRight={'16px'}
                      height={'32px'}
                      minWidth={'88px'}
                    >
                      <Typography
                        fontSize="16px"
                        fontWeight={700}
                        lineHeight="20px"
                        color={'#ffffff'}
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
                      onClick={handleClick}
                      platform={platform}
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
