'use client';
import { useTranslation } from 'react-i18next';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import {
  alpha,
  Box,
  Container,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import type { TabProps } from 'src/components/Tabs';
import { Tabs } from 'src/components/Tabs';
import { getSiteUrl } from 'src/const/urls';
import { useMenuStore } from 'src/stores/menu';
import type { Quest } from 'src/types/loyaltyPass';
import type { QuestDetails } from 'src/types/questDetails';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { BackButton } from '../BackButton/BackButton';
import {
  ZapActionProtocolCard,
  ZapActionProtocolDisclaimer,
  ZapActionProtocolIntro,
  ZapActionProtocolShare,
  ZapActionProtocolShareLink,
  ZapProtocolActionBox,
  ZapProtocolActionInfoBox,
} from './ZapAction.style';
import { ZapActionFaqAccordionHeader } from './ZapActionFaqAccordionHeader';
import { ZapWidget } from './Zapwidget';

interface ZapActionProps {
  market?: Quest;
  detailInformation?: QuestDetails;
}

export const ZapAction = ({ market, detailInformation }: ZapActionProps) => {
  const [tab, setTab] = useState(0);
  const { setSnackbarState } = useMenuStore((state) => state);
  const { t } = useTranslation();
  const baseUrl = getStrapiBaseUrl();
  const theme = useTheme();

  const containerStyles = {
    display: 'flex',
    width: '100%',
    borderRadius: '24px',
    div: {
      height: 38,
    },
    '.MuiTabs-indicator': {
      height: 38,
      zIndex: -1,
      borderRadius: '18px',
    },
  };

  const tabStyles = {
    height: 38,
    margin: theme.spacing(0.75),
    minWidth: 'unset',
    borderRadius: '18px',
  };

  const tabs: TabProps[] = [
    {
      label: 'Get USDz',
      value: 0,
      onClick: () => {
        setTab(0);
      },
    },
    {
      label: 'Deposit',
      value: 1,
      onClick: () => {
        setTab(1);
      },
    },
    {
      label: 'Withdraw',
      value: 1,
      onClick: () => {
        setTab(2);
      },
    },
  ];

  const handleCopyButton = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  return (
    <Container className="mycontainer">
      {/* <BerachainBackButton>
          <ArrowBackIcon />
          <Typography variant="bodySmallStrong">Explore Berachain</Typography>
          </BerachainBackButton> */}
      <ZapProtocolActionBox>
        <Box>
          <BackButton />
          <ZapProtocolActionInfoBox>
            <ZapActionProtocolIntro>
              {market?.attributes.Image.data.attributes.url ? (
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
              <ZapActionProtocolCard>
                {market?.attributes.Title ? (
                  <Typography variant="titleSmall">
                    What is {market.attributes.Title}?
                  </Typography>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ height: '32px', width: '160px' }}
                  />
                )}
                {market?.attributes.Information ? (
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
                        <ZapActionProtocolShareLink
                          href={detailInformation?.socials?.twitter}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          <ZapActionProtocolShare>
                            <XIcon sx={{ width: '16px', height: '16px' }} />
                          </ZapActionProtocolShare>
                        </ZapActionProtocolShareLink>
                      )}
                      {detailInformation?.socials?.telegram && (
                        <ZapActionProtocolShareLink
                          href={detailInformation?.socials?.telegram}
                        >
                          <ZapActionProtocolShare>
                            <TelegramIcon
                              sx={{ width: '16px', height: '16px' }}
                            />
                          </ZapActionProtocolShare>
                        </ZapActionProtocolShareLink>
                      )}
                      {detailInformation?.socials?.website && (
                        <ZapActionProtocolShareLink
                          href={detailInformation?.socials?.website}
                        >
                          <ZapActionProtocolShare>
                            <LanguageIcon
                              sx={{ width: '16px', height: '16px' }}
                            />
                          </ZapActionProtocolShare>
                        </ZapActionProtocolShareLink>
                      )}
                    </>
                  )}
                  {market?.attributes.Slug && (
                    <ZapActionProtocolShare
                      onClick={() =>
                        handleCopyButton(
                          `${getSiteUrl()}/zap/${market.attributes.Slug}`,
                        )
                      }
                    >
                      <ContentCopyIcon sx={{ width: '16px', height: '16px' }} />
                    </ZapActionProtocolShare>
                  )}
                </Box>
              </ZapActionProtocolCard>
            </ZapActionProtocolIntro>
            {detailInformation?.faqItems && (
              <ZapActionProtocolCard sx={{ padding: '20px 12px' }}>
                <AccordionFAQ
                  showIndex={true}
                  showDivider={true}
                  showAnswerDivider={true}
                  sx={{
                    padding: 0,
                    '> .accordion-items div:hover': {
                      background: '#F9F9F9',
                    },
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
                    // '& > div': {
                    //   borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.04)}`,
                    // },
                    // '&:first-of-type > div': {
                    //   borderTop: 'unset',
                    // },
                  }}
                  content={detailInformation?.faqItems}
                  accordionHeader={<ZapActionFaqAccordionHeader />}
                  questionTextTypography="bodyLarge"
                  answerTextTypography="bodyMedium"
                  arrowSize={12}
                />
              </ZapActionProtocolCard>
            )}
            <ZapActionProtocolDisclaimer>
              <InfoIcon
                sx={(theme) => ({
                  color: alpha(theme.palette.text.primary, 0.48),
                })}
              />
              <Typography variant="bodySmall">
                {market?.attributes.Information}
              </Typography>
            </ZapActionProtocolDisclaimer>
          </ZapProtocolActionInfoBox>
        </Box>
        <Box
          sx={{
            marginTop: theme.spacing(8),
            padding: theme.spacing(3, 1),
            borderRadius: '24px',
            backgroundColor: theme.palette.surface1.main,
            boxShadow:
              theme.palette.mode === 'light'
                ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
                : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
          }}
        >
          <Tabs
            data={tabs}
            value={tab}
            ariaLabel="zap-switch-tabs"
            containerStyles={containerStyles}
            tabStyles={tabStyles}
          />
          {tab === 0 ? (
            <Box sx={{ marginTop: theme.spacing(1.5) }}>
              <ZapWidget starterVariant={'default'} autoHeight={true} />
            </Box>
          ) : null}
          {tab === 1 ? (
            <Box sx={{ marginTop: theme.spacing(1.5) }}>
              <ZapWidget starterVariant={'refuel'} autoHeight={true} />
            </Box>
          ) : null}
          {tab === 2 ? (
            <Box sx={{ marginTop: theme.spacing(1.5) }}>
              <ZapWidget starterVariant={'custom'} autoHeight={true} />
            </Box>
          ) : null}
        </Box>
      </ZapProtocolActionBox>
    </Container>
  );
};
