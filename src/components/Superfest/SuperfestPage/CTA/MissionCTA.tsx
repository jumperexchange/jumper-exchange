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
  CTAExplanationBox,
} from './MissionCTA.style';
import { type Theme, useMediaQuery, Box } from '@mui/material';
import Image from 'next/image';
import { SoraTypography } from '../../Superfest.style';
import { SignatureCTA } from '../SignatureCTA/SignatureCTA';

interface CTALinkInt {
  logo: string;
  text: string;
  link: string;
}

interface SignatureInt {
  isLive: boolean;
  message: string;
}

interface MissionCtaProps {
  title?: string;
  url?: string;
  id?: number;
  CTAs: CTALinkInt[];
  signature?: SignatureInt;
}

export const MissionCTA = ({ CTAs, signature }: MissionCtaProps) => {
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
        <Box marginTop="32px">
          <SoraTypography
            fontSize={{ xs: '14px', md: '18px' }}
            lineHeight={{ xs: '14px', md: '18px' }}
            fontWeight={400}
          >
            {signature?.isLive
              ? undefined
              : 'Completing any mission below makes you eligible for OP rewards and XP.'}
          </SoraTypography>
        </Box>
      </StartedTitleBox>
      <SeveralCTABox>
        {true ? <SignatureCTA /> : undefined}
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
                    fontSize={{ xs: '16px', sm: '22px' }}
                    fontWeight={700}
                    marginLeft={'16px'}
                  >
                    {CTA.text ?? 'Go to Protocol Page'}
                  </SoraTypography>
                </CTAExplanationBox>
                {isMobile ? undefined : (
                  <IconButtonPrimary onClick={handleClick}>
                    <ArrowForwardIcon
                      sx={{
                        width: '28px',
                        height: '28px',
                      }}
                    />
                  </IconButtonPrimary>
                )}
              </SeveralMissionCtaContainer>
            </Link>
          );
        })}
      </SeveralCTABox>
    </CTAMainBox>
  );
};
