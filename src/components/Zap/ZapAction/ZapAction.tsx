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
import { formatUnits } from 'viem';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { TokenAmount } from '@lifi/widget';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import type { TabProps } from 'src/components/Tabs';
import { Tabs } from 'src/components/Tabs';
import { getSiteUrl } from 'src/const/urls';
import { useMenuStore } from 'src/stores/menu';
import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
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
import CustomWidgetPage from '@/app/ui/custom-widget/CustomWidgetPage';
import WidgetLikeField from '../WidgetLikeField/WidgetLikeField';
import { useZaps } from 'src/hooks/useZaps';
import { useContractRead } from 'src/hooks/useReadContractData';
import { useAccount } from '@lifi/wallet-management';

interface ZapActionProps {
  market?: Quest;
  detailInformation?: CustomInformation;
}

export const ZapAction = ({ market, detailInformation }: ZapActionProps) => {
  const [tab, setTab] = useState(0);
  const { setSnackbarState } = useMenuStore((state) => state);
  const { data, isSuccess } = useZaps(detailInformation?.projectData);
  const [token, setToken] = useState<TokenAmount>();
  const { t } = useTranslation();
  const baseUrl = getStrapiBaseUrl();
  const theme = useTheme();
  const { account } = useAccount();

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

  const { data: depositTokenData, isLoading: isLoadingDepositTokenData } =
    useContractRead({
      address: detailInformation?.projectData as `0x${string}`,
      chainId: detailInformation?.projectData.chainId,
      functionName: 'balanceOf',
      abi: [
        {
          inputs: [{ name: 'owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      args: [account.address],
    });

  useEffect(() => {
    if (isSuccess) {
      setToken({
        chainId: detailInformation?.projectData?.chainId,
        address: data?.data?.market?.address as `0x${string}`,
        symbol: data?.data?.market?.lpToken.symbol,
        name: data?.data?.market?.lpToken.name,
        decimals: data?.data?.market?.lpToken.decimals,
        priceUSD: '0',
        coinKey: data?.data?.market?.lpToken.name as any,
        logoURI: data?.data?.meta?.logoURI,
        amount: '0' as any,
      });
    }
  }, [isSuccess]);

  const tabStyles = {
    height: 38,
    margin: theme.spacing(0.75),
    minWidth: 'unset',
    borderRadius: '18px',
  };

  const handleCopyButton = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  const tabs: TabProps[] = [
    { label: 'Deposit', value: 0, onClick: () => setTab(0) },
    { label: 'Withdraw', value: 1, onClick: () => setTab(1) },
  ];

  const renderZapWidget = () => {
    switch (tab) {
      case 0:
        return detailInformation?.projectData ? (
          <>
            <CustomWidgetPage projectData={detailInformation?.projectData} />
          </>
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ height: '200px', width: '416px', borderRadius: '8px' }}
          />
        );
      case 1:
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              minWidth: 416,
            }}
          >
            <WidgetLikeField
              contractCalls={[
                {
                  data: '0x',
                  type: 'send',
                  label: 'Redeem',
                  onVerify: () => Promise.resolve(true),
                },
              ]}
              label="Redeem"
              image={{
                url: token?.logoURI || '',
                name: token?.name || '',
              }}
              placeholder="0.00"
              helperText={{
                left: 'Available balance',
                right: depositTokenData
                  ? formatUnits(depositTokenData, token?.decimals ?? 18)
                  : '0.00',
              }}
              balance={
                depositTokenData
                  ? formatUnits(depositTokenData, token?.decimals ?? 18)
                  : '0.00'
              }
              projectData={detailInformation?.projectData}
            />
          </Box>
        );
      default:
        return (
          <Skeleton
            variant="rectangular"
            sx={{ height: '200px', width: '416px', borderRadius: '8px' }}
          />
        );
    }
  };

  return (
    <Container>
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
                    {market.attributes.Title}
                  </Typography>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ height: '32px', width: '160px' }}
                  />
                )}
                {
                  market?.attributes?.Description && (
                    <Typography variant="bodyMedium">
                      {market.attributes.Description}
                    </Typography>
                  )
                  // : (
                  //   <Skeleton
                  //     variant="rectangular"
                  //     sx={{ height: '72px', width: '100%', borderRadius: '8px' }}
                  //   />
                  // )
                }
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
            {market?.attributes?.Information && (
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
            )}
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
          <Box sx={{ marginTop: theme.spacing(1.5), minWidth: '416px' }}>
            {renderZapWidget()}
          </Box>
        </Box>
      </ZapProtocolActionBox>
    </Container>
  );
};
