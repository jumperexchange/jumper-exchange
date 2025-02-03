import DepositWidget from '@/components/Berachain/components/BerachainWidget/DepositWidget/DepositWidget';
import { WithdrawWidget } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawWidget';
import { useChains } from '@/hooks/useChains';
import type { Breakpoint, Theme } from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EnrichedMarketDataType } from 'royco/queries';
import { type TabProps, Tabs } from 'src/components/Tabs/Tabs';
import { Widget } from 'src/components/Widgets/Widget';
import { titleSlicer } from '@/components/Berachain/utils';
import { ClaimingInformation } from '@/components/Berachain/components/BerachainWidget/ClaimingInformation';
import { Univ2Information } from '@/components/Berachain/components/BerachainWidget/Univ2Information';

export const BerachainWidget = ({
  market,
  appLink,
  appName,
  fullAppName,
}: {
  market: EnrichedMarketDataType;
  appLink: string;
  appName?: string;
  fullAppName?: string;
}) => {
  const [tab, setTab] = useState(1);
  const { t } = useTranslation();
  const theme = useTheme();
  const chains = useChains();
  const chain = useMemo(
    () => chains.getChainById(market?.chain_id!),
    [market?.chain_id],
  );
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const token = useMemo(() => {
    return market.input_token_data;
  }, [market?.input_token_data]);

  const containerStyles = {
    display: 'flex',
    width: '100%',
    borderRadius: '24px',
    backgroundColor: '#1E1D1C',
    fontSize: '0.875rem',
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
    fontSize: '0.875rem',
    margin: theme.spacing(0.75),
    minWidth: 'unset',
    borderRadius: '18px',
  };

  const tabs: TabProps[] = [
    {
      label: isMobile ? 'Swap' : `Get ${titleSlicer(token.symbol)}`,
      value: 0,
      onClick: () => {
        setTab(0);
      },
    },
    {
      label: isMobile ? 'Invest' : `Deposit`,
      value: 1,
      onClick: () => {
        setTab(1);
      },
    },
    {
      label: 'Positions',
      value: 1,
      onClick: () => {
        setTab(2);
      },
    },
  ];

  return (
    <Box
      sx={{
        minWidth: '464px',
        width: '480px',
        borderRadius: '24px',
        backgroundColor: '#121214',
        boxShadow: theme.shadows[1],
        [theme.breakpoints.up('md' as Breakpoint)]: {
          padding: theme.spacing(3),
        },
      }}
    >
      {/* <Typography variant="h2" color="text.primary" sx={{ mb: 3 }}>
        {market.name}
      </Typography> */}
      <Tabs
        data={tabs}
        value={tab}
        ariaLabel="zap-switch-tabs"
        containerStyles={containerStyles}
        tabStyles={tabStyles}
      />
      <Box sx={{ marginTop: 3 }}>
        {tab === 0 && (
          <Box
            sx={{
              marginTop: theme.spacing(1.5),
              '.widget-wrapper > div > div': {
                maxWidth: '100%!important',
              },
              '.widget-wrapper .MuiContainer-root': {
                padding: 0,
              },
            }}
          >
            {token.type === 'lp' ? (
              <Univ2Information
                link={`https://app.uniswap.org/explore/pools/ethereum/${token.contract_address}`}
                appName={appName}
              />
            ) : (
              <Widget
                // @ts-expect-error
                starterVariant="compact"
                toChain={token?.chain_id}
                toToken={token?.contract_address}
              />
            )}
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ marginTop: theme.spacing(1.5) }}>
            {/*<InfoBlock market={market} type="deposit" />*/}
            <DepositWidget
              appName={fullAppName}
              market={market}
              chain={chain}
              contractCalls={[]}
              overrideStyle={{ mainColor: '#FF8425' }}
              label=""
              placeholder="0"
              image={{
                url: market.input_token_data.image,
                name: market.input_token_data.name,
                badge: {
                  url: chain?.logoURI,
                  name: chain?.name,
                },
              }}
            />
          </Box>
        )}
        {tab === 2 && (
          <WithdrawWidget
            market={market}
            image={{
              url: market.input_token_data.image,
              name: market.input_token_data.name,
              badge: {
                url: chain?.logoURI,
                name: chain?.name,
              },
            }}
            chain={chain}
            overrideStyle={{ mainColor: '#FF8425' }}
            appLink={appLink}
            appName={appName}
            fullAppName={fullAppName}
          />
        )}
      </Box>
    </Box>
  );
};
