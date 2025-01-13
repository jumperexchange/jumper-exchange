'use client';

import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { alpha, Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material';
import {
  ZapActionProtocolCard,
  ZapActionProtocolDisclaimer,
  ZapActionProtocolIntro,
  ZapActionProtocolShare,
  ZapActionProtocolShareLink,
  ZapProtocolActionInfoBox,
} from './ZapInfo.style';
import { ZapActionFaqAccordionHeader } from './ZapActionFaqAccordionHeader';
import { SocialInfosBox } from './SocialInfosBox';

interface ZapPageProps {
  market?: Quest;
  detailInformation?: CustomInformation;
}

export const ZapInfo = ({ market, detailInformation }: ZapPageProps) => {
  const baseUrl = getStrapiBaseUrl();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <ZapProtocolActionInfoBox>
      {/* Main Information about the protocol */}
      <ZapActionProtocolIntro>
        {!isMobile &&
          (market?.attributes?.Image.data.attributes?.url ? (
            <Image
              src={`${baseUrl}${market.attributes?.Image.data.attributes?.url}`}
              alt="Protocol image"
              width={market.attributes?.Image.data.attributes?.width}
              height={market.attributes?.Image.data.attributes?.height}
              style={{ width: 192, height: 'auto', objectFit: 'contain' }}
            />
          ) : (
            <Skeleton
              variant="circular"
              sx={{ width: '192px', height: '192px', flexShrink: 0 }}
            />
          ))}

        <ZapActionProtocolCard>
          {market?.attributes?.Title ? (
            <Typography variant="titleSmall">
              {market.attributes?.Title}
            </Typography>
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{ height: '32px', width: '160px' }}
            />
          )}
          {market?.attributes?.Description && (
            <Typography variant="bodyMedium">
              {market.attributes?.Description}
            </Typography>
          )}
          <SocialInfosBox detailInformation={detailInformation} />
        </ZapActionProtocolCard>
      </ZapActionProtocolIntro>

      {/* FAQ about the Zap and the pool */}
      {detailInformation?.faqItems && (
        <ZapActionProtocolCard sx={{ padding: '20px 12px' }}>
          <AccordionFAQ
            showIndex={true}
            showDivider={true}
            showAnswerDivider={true}
            sx={{
              padding: 0,
            }}
            itemSx={{
              padding: '0px 8px',
              backgroundColor: 'transparent',
              '.MuiAccordionSummary-root': {
                padding: 0,
              },
              '.accordion-items': {
                gap: '4px',
              },
              '.MuiAccordionDetails-root': {
                padding: '20px 16px 16px',
              },
            }}
            content={detailInformation?.faqItems}
            accordionHeader={<ZapActionFaqAccordionHeader />}
            questionTextTypography="bodyLarge"
            answerTextTypography="bodyMedium"
            arrowSize={12}
          />
        </ZapActionProtocolCard>
      )}

      {/* Disclaimer about the pool */}
      {market?.attributes?.Information && (
        <ZapActionProtocolDisclaimer>
          <InfoIcon
            sx={(theme) => ({
              color: alpha(theme.palette.text.primary, 0.48),
            })}
          />
          <Typography variant="bodySmall">
            {market?.attributes?.Information}
          </Typography>
        </ZapActionProtocolDisclaimer>
      )}
    </ZapProtocolActionInfoBox>
  );
};
