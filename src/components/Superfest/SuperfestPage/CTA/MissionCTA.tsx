import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, type Theme, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  CTAExplanationBox,
  CTAMainBox,
  MissionCtaButton,
  SeveralCTABox,
  SeveralMissionCtaContainer,
  StartedTitleBox,
  StartedTitleTypography,
} from './MissionCTA.style';
import Image from 'next/image';
import { SoraTypography } from '../../Superfest.style';
import { FlexCenterRowBox } from '../SuperfestMissionPage.style';
import { XPDisplayBox } from 'src/components/ProfilePage/QuestCard/QuestCard.style';
import { XPIconBox } from '../../QuestCard/QuestCard.style';
import { APYIcon } from 'src/components/illustrations/APYIcon';

export interface CTALinkInt {
  logo: string;
  text: string;
  link: string;
  claimingId: string;
  rewardId?: string;
  apy?: number;
}

interface MissionCtaProps {
  title?: string;
  url?: string;
  id?: number;
  CTAs: CTALinkInt[];
}

export const MissionCTA = ({ CTAs }: MissionCtaProps) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
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
        <Box marginTop="32px">
          <SoraTypography
            fontSize={{ xs: '14px', md: '18px' }}
            lineHeight={{ xs: '14px', md: '18px' }}
            fontWeight={400}
          >
            Completing any mission below makes you eligible for OP rewards and
            XP.
          </SoraTypography>
        </Box>
      </StartedTitleBox>
      <SeveralCTABox>
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
                  <SoraTypography
                    marginTop={{ xs: '16px', md: '0px' }}
                    fontSize={{ xs: '16px', sm: '22px' }}
                    fontWeight={700}
                    marginLeft={'16px'}
                  >
                    {CTA.text ?? 'Go to Protocol Page'}
                  </SoraTypography>
                </CTAExplanationBox>
                <FlexCenterRowBox>
                {CTA.apy ? (
                <XPDisplayBox
                bgcolor={'#ff0420'}
                marginRight={'16px'}
                minWidth={"96px"}
                >
                  <SoraTypography
                    fontSize="14px"
                    fontWeight={700}
                    lineHeight="18px"
                    color={'#ffffff'}
                  >
                    {`${Number(CTA.apy).toFixed(1)}%`}
                  </SoraTypography>
                  <XPIconBox marginLeft="4px">
                      <APYIcon size={20} />
                  </XPIconBox>
                </XPDisplayBox>
                  ) : undefined}
                {isMobile ? undefined : (
                  <MissionCtaButton onClick={handleClick}>
                    <ArrowForwardIcon
                      sx={{
                        color: '#000000',
                        width: '28px',
                        height: '28px',
                      }}
                    />
                  </MissionCtaButton>
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
