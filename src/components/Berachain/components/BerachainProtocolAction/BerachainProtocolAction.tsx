import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import { getSiteUrl } from 'src/const/urls';
import { useMenuStore } from 'src/stores/menu';
import type { Quest } from 'src/types/loyaltyPass';
import type { QuestDetails } from 'src/types/questDetails';
import { BerachainWidget } from '../BerachainWidget/BerachainWidget';
import {
  BerachainActionProtocolCard,
  BerachainActionProtocolIntro,
  BerachainActionProtocolShare,
  BerachainActionProtocolShareLink,
  BerachainProtocolActionBox,
  BerachainProtocolActionInfoBox,
} from './BerachainProtocolAction.style';
import { BerachainProtocolFaqAccordionHeader } from './BerachainProtocolFaqAccordionHeader';

interface BerachainProtocolActionProps {
  market?: Quest;
  detailInformation?: QuestDetails;
}

export function getStrapiBaseUrl() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}`;
  return apiBaseUrl;
}

export const BerachainProtocolAction = ({
  market,
  detailInformation,
}: BerachainProtocolActionProps) => {
  const { setSnackbarState } = useMenuStore((state) => state);
  const { t } = useTranslation();
  const baseUrl = getStrapiBaseUrl();

  const handleCopyButton = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  return market ? (
    <BerachainProtocolActionBox>
      <BerachainProtocolActionInfoBox>
        <BerachainActionProtocolIntro>
          {market.attributes.Image.data.attributes.url ? (
            <Image
              src={`${baseUrl}${market.attributes.Image.data.attributes.url}`}
              alt="Protocol image"
              width={market.attributes.Image.data.attributes.width}
              height={market.attributes.Image.data.attributes.height}
              style={{ width: 192, height: 'auto', objectFit: 'contain' }}
            />
          ) : (
            <Skeleton
              variant="circular"
              sx={{ width: '192px', height: '192px', flexShrink: 0 }}
            />
          )}
          <BerachainActionProtocolCard>
            {market.attributes.Title ? (
              <Typography variant="titleSmall">
                What is {market.attributes.Title}?
              </Typography>
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ height: '32px', width: '160px' }}
              />
            )}
            {market.attributes.Information ? (
              <Typography variant="bodyMedium">
                {market.attributes.Information}
              </Typography>
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ height: '72px', width: '100%', borderRadius: '8px' }}
              />
            )}
            <Box sx={{ display: 'flex', gap: '12px' }}>
              {detailInformation?.socials && (
                <>
                  {detailInformation?.socials?.twitter && (
                    <BerachainActionProtocolShareLink
                      href={detailInformation?.socials?.twitter}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <BerachainActionProtocolShare>
                        <XIcon sx={{ width: '16px', height: '16px' }} />
                      </BerachainActionProtocolShare>
                    </BerachainActionProtocolShareLink>
                  )}
                  {detailInformation?.socials?.telegram && (
                    <BerachainActionProtocolShareLink
                      href={detailInformation?.socials?.telegram}
                    >
                      <BerachainActionProtocolShare>
                        <TelegramIcon sx={{ width: '16px', height: '16px' }} />
                      </BerachainActionProtocolShare>
                    </BerachainActionProtocolShareLink>
                  )}
                  {detailInformation?.socials?.website && (
                    <BerachainActionProtocolShareLink
                      href={detailInformation?.socials?.website}
                    >
                      <BerachainActionProtocolShare>
                        <LanguageIcon sx={{ width: '16px', height: '16px' }} />
                      </BerachainActionProtocolShare>
                    </BerachainActionProtocolShareLink>
                  )}
                </>
              )}
              <BerachainActionProtocolShare
                onClick={() =>
                  handleCopyButton(
                    `${getSiteUrl()}/berachain/explore/${market.attributes.Slug}`,
                  )
                }
              >
                <ContentCopyIcon sx={{ width: '16px', height: '16px' }} />
              </BerachainActionProtocolShare>
            </Box>
          </BerachainActionProtocolCard>
        </BerachainActionProtocolIntro>
        {detailInformation?.faqItems && (
          <BerachainActionProtocolCard sx={{ padding: '20px 12px' }}>
            <AccordionFAQ
              showIndex={true}
              showDivider={true}
              showAnswerDivider={true}
              sx={{ padding: 0 }}
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
                // '& > div': {
                //   borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.04)}`,
                // },
                // '&:first-of-type > div': {
                //   borderTop: 'unset',
                // },
              }}
              content={detailInformation?.faqItems}
              accordionHeader={<BerachainProtocolFaqAccordionHeader />}
              questionTextTypography="bodyLarge"
              answerTextTypography="bodyMedium"
              arrowSize={12}
            />
          </BerachainActionProtocolCard>
        )}
        <BerachainActionProtocolCard
          sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: '12px' }}
        >
          <InfoIcon />
          <Typography variant="bodySmall">
            {market.attributes.Information}
          </Typography>
        </BerachainActionProtocolCard>
      </BerachainProtocolActionInfoBox>
      <BerachainWidget />
    </BerachainProtocolActionBox>
  ) : null;
};