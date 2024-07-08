import { IconButtonPrimary } from '@/components/IconButton.style';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  SeveralCTABox,
  StartedTitleTypography,
  SeveralMissionCtaContainer,
  StartedTitleBox,
  CTAMainBox,
} from './MissionCTA.style';
import { type Theme, useMediaQuery, Box } from '@mui/material';
import Image from 'next/image';
import { SoraTypography } from '../../Superfest.style';
import { FlexCenterRowBox } from '../SuperfestMissionPage.style';

interface CTALinkInt {
  logo: string;
  text: string;
  link: string;
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
                <FlexCenterRowBox>
                  <Image
                    src={CTA.logo}
                    alt={`Image for ${CTA.logo}`}
                    width={48}
                    height={48}
                    priority={false}
                  />
                  <SoraTypography
                    fontSize={'22px'}
                    fontWeight={700}
                    marginLeft={'16px'}
                  >
                    {CTA.text ?? 'Go to Protocol Page'}
                  </SoraTypography>
                </FlexCenterRowBox>
                <IconButtonPrimary onClick={handleClick}>
                  <ArrowForwardIcon
                    sx={{
                      width: '28px',
                      height: '28px',
                    }}
                  />
                </IconButtonPrimary>
              </SeveralMissionCtaContainer>
            </Link>
          );
        })}
      </SeveralCTABox>
    </CTAMainBox>
  );
};
