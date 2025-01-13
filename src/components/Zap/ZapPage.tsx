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
import { BackButton } from './BackButton/BackButton';
import {
  ZapActionProtocolCard,
  ZapActionProtocolDisclaimer,
  ZapActionProtocolIntro,
  ZapActionProtocolShare,
  ZapActionProtocolShareLink,
  ZapProtocolActionBox,
  ZapProtocolActionInfoBox,
  ZapTabsBox,
} from './ZapInfo/ZapInfo.style';
import ZapWidgetPage from 'src/app/ui/widget/ZapWidgetPage';
import { useZaps } from 'src/hooks/useZaps';
import { useContractRead } from 'src/hooks/useReadContractData';
import { useAccount } from '@lifi/wallet-management';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material';
import { Breakpoint } from '@mui/material';
import { ZapInfo } from './ZapInfo/ZapInfo';

interface ZapPageProps {
  market?: Quest;
  detailInformation?: CustomInformation;
}

export const ZapPage = ({ market, detailInformation }: ZapPageProps) => {
  const [tab, setTab] = useState(0);
  const { setSnackbarState } = useMenuStore((state) => state);
  const { data, isSuccess } = useZaps(detailInformation?.projectData);
  const [token, setToken] = useState<TokenAmount>();
  const { t } = useTranslation();
  const baseUrl = getStrapiBaseUrl();
  const theme = useTheme();
  const { account } = useAccount();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

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

  const tabs: TabProps[] = [
    { label: 'Deposit', value: 0, onClick: () => setTab(0) },
    { label: 'Withdraw', value: 1, onClick: () => setTab(1) },
  ];

  const renderZapWidget = () => {
    switch (tab) {
      case 0:
        return detailInformation?.projectData ? (
          <>
            <ZapWidgetPage
              customInformation={detailInformation}
              type="deposit"
            />
          </>
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{
              height: '200px',
              borderRadius: '8px',
              [theme.breakpoints.down('md' as Breakpoint)]: {
                width: 316,
              },
              [theme.breakpoints.up('md' as Breakpoint)]: {
                width: 416,
              },
            }}
          />
        );
      case 1:
        return detailInformation?.projectData ? (
          <>
            <ZapWidgetPage
              customInformation={detailInformation}
              type="withdraw"
            />
          </>
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ height: '200px', width: '416px', borderRadius: '8px' }}
          />
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
      <BackButton />
      <ZapProtocolActionBox>
        {/* widget on mobile */}
        {isMobile && (
          <ZapTabsBox>
            <Tabs
              data={tabs}
              value={tab}
              ariaLabel="zap-switch-tabs"
              containerStyles={containerStyles}
              tabStyles={tabStyles}
            />
            {renderZapWidget()}
          </ZapTabsBox>
        )}

        {/* Information Container */}
        <ZapInfo market={market} detailInformation={detailInformation} />

        {/* widget on web */}
        {!isMobile && (
          <ZapTabsBox>
            <Tabs
              data={tabs}
              value={tab}
              ariaLabel="zap-switch-tabs"
              containerStyles={containerStyles}
              tabStyles={tabStyles}
            />
            {renderZapWidget()}
          </ZapTabsBox>
        )}
      </ZapProtocolActionBox>
    </Container>
  );
};
