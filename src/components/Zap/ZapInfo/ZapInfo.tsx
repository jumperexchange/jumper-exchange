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
import type { Theme } from '@mui/material';
import {
  ZapActionProtocolCard,
  ZapActionProtocolDisclaimer,
  ZapActionProtocolIntro,
  ZapActionProtocolShare,
  ZapActionProtocolShareLink,
  ZapProtocolActionInfoBox,
} from './ZapInfo.style';
import { SocialInfosBox } from './SocialInfosBox';
import { ZapProtocolIntro } from './ZapProtocolIntro';
import { ZapDisclaimerInfo } from './ZapDisclaimerInfo';
import { ZapActionFaq } from './ZapActionFaq';
import { BackButton } from '@/components/Zap/BackButton/BackButton';

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
      <BackButton />
      {/* Main Information about the protocol */}
      <ZapProtocolIntro market={market} detailInformation={detailInformation} />

      {/* FAQ about the Zap and the pool */}
      {detailInformation?.faqItems && (
        <ZapActionFaq detailInformation={detailInformation} />
      )}

      {/* Disclaimer about the pool */}
      {market?.attributes?.Information && <ZapDisclaimerInfo market={market} />}
    </ZapProtocolActionInfoBox>
  );
};
