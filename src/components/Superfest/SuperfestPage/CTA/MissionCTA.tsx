import { IconButtonPrimary } from '@/components/IconButton.style';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  MissionCtaContainer,
  MissionCtaTitle,
  SeveralCTABox,
  SeveralMissionCtaContainer,
} from './MissionCTA.style';
import { type Theme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { SoraTypography } from '../../Superfest.style';

interface CTALinkInt {
  logo: string;
  text: string;
  link: string;
}

interface MissionCtaProps {
  title?: string;
  url?: string;
  id?: number;
  CTAs?: CTALinkInt[];
}

export const MissionCTA = ({ title, url, id, CTAs }: MissionCtaProps) => {
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
    <>
      {CTAs && CTAs.length > 1 ? (
        <SeveralCTABox>
          {CTAs.map((CTA: CTALinkInt, i: number) => {
            return (
              <Link
                key={`cta-mission-${i}`}
                style={{
                  textDecoration: 'none',
                  width: isMobile ? '100%' : '49%',
                  color: 'inherit',
                  marginBottom: '16px',
                }}
                href={CTA.link || '/'}
                target="_blank"
              >
                <SeveralMissionCtaContainer onClick={handleClick}>
                  <Image
                    src={CTA.logo}
                    alt={`Image for ${CTA.logo}`}
                    width={48}
                    height={48}
                    priority={false}
                  />
                  <SoraTypography fontSize={'22px'} fontWeight={700}>
                    {CTA.text ?? 'Go to Protocol Page'}
                  </SoraTypography>
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
      ) : (
        <Link
          style={{ textDecoration: 'none', width: '80%', color: 'inherit' }}
          href={(CTAs?.length === 1 && CTAs[0].link) || url || '/'}
          target="_blank"
        >
          <MissionCtaContainer onClick={handleClick}>
            <MissionCtaTitle>
              {((CTAs?.length === 1 && CTAs[0].text) || title) ??
                'Go to Protocol Page'}
            </MissionCtaTitle>
            <IconButtonPrimary onClick={handleClick}>
              <ArrowForwardIcon
                sx={{
                  width: '28px',
                  height: '28px',
                }}
              />
            </IconButtonPrimary>
          </MissionCtaContainer>
        </Link>
      )}
    </>
  );
};
