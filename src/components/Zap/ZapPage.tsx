'use client';
import type { TokenAmount } from '@lifi/widget';
import type { Breakpoint, Theme } from '@mui/material';
import {
  Box,
  Container,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ZapWidgetPage from 'src/app/ui/widget/ZapWidgetPage';
import type { TabProps } from 'src/components/Tabs';
import { Tabs } from 'src/components/Tabs';
import { useZaps } from 'src/hooks/useZaps';
import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { ZapInfo } from './ZapInfo/ZapInfo';
import { ZapProtocolActionBox, ZapTabsBox } from './ZapInfo/ZapInfo.style';

interface ZapPageProps {
  market?: Quest;
  detailInformation?: CustomInformation;
}

export const ZapPage = ({ market, detailInformation }: ZapPageProps) => {
  const [tab, setTab] = useState(0);
  const { data, isSuccess, refetch } = useZaps(detailInformation?.projectData);
  const [token, setToken] = useState<TokenAmount>();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const containerStyles = {
    display: 'flex',
    width: 'auto',
    marginX: 2,
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
    maxWidth: 'unset',
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
            <Box
              sx={{
                marginTop: theme.spacing(1.5),
                [theme.breakpoints.up('sm')]: {
                  minWidth: '416px',
                },
              }}
            >
              {renderZapWidget()}
            </Box>
          </ZapTabsBox>
        )}

        {/* Information Container */}
        <ZapInfo market={market} detailInformation={detailInformation} />

        {/* widget on web */}

        <>
          {!isMobile && (
            <ZapTabsBox>
              <Tabs
                data={tabs}
                value={tab}
                ariaLabel="zap-switch-tabs"
                containerStyles={containerStyles}
                tabStyles={tabStyles}
              />
              {!isSuccess ? (
                <Skeleton
                  variant="rectangular"
                  sx={{
                    marginX: 2,
                    marginTop: theme.spacing(2),
                    height: '600px',
                    borderRadius: '8px',
                    [theme.breakpoints.down('md' as Breakpoint)]: {
                      width: 284,
                    },
                    [theme.breakpoints.up('md' as Breakpoint)]: {
                      width: 384,
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    [theme.breakpoints.down('md' as Breakpoint)]: {
                      minWidth: '316px',
                    },
                    [theme.breakpoints.up('md' as Breakpoint)]: {
                      minWidth: '416px',
                    },
                  }}
                >
                  {renderZapWidget()}
                </Box>
              )}
            </ZapTabsBox>
          )}
        </>
      </ZapProtocolActionBox>
    </Container>
  );
};
