import type { Breakpoint, Theme } from '@mui/material';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { type TabProps, Tabs } from 'src/components/Tabs/Tabs';
import { Widget } from 'src/components/Widgets/Widget';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useTranslation } from 'react-i18next';
import BerachainTransactionDetails from '@/components/Berachain/components/BerachainTransactionDetails/BerachainTransactionDetails';
import InfoBlock from '@/components/Berachain/components/BerachainWidget/InfoBlock';
import { WithdrawWidget } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawWidget';
import DepositWidget from '@/components/Berachain/components/BerachainWidget/DepositWidget/DepositWidget';
import { useChains } from '@/hooks/useChains';

export const BerachainWidget = ({
  market,
  appLink,
  appName,
}: {
  market: EnrichedMarketDataType;
  appLink?: string;
  appName?: string;
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
      label: isMobile ? 'Swap' : `Get ${token.symbol}`,
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
      label: 'Withdraw',
      value: 1,
      onClick: () => {
        setTab(2);
      },
    },
  ];

  // TODO: to remove
  // eslint-disable-next-line no-console
  // console.log('market', market);
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '24px',
        backgroundColor: '#121214',
        boxShadow:
          theme.palette.mode === 'light'
            ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
            : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
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
      <Box>
        {tab === 0 && (
          <Box
            sx={{
              marginTop: theme.spacing(1.5),
              '.widget-wrapper > div > div': {
                maxWidth: '100%!important',
              },
            }}
          >
            <Widget
              // @ts-expect-error
              starterVariant="compact"
              toChain={token?.chain_id}
              toToken={token?.contract_address}
            />
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ marginTop: theme.spacing(1.5) }}>
            {/*<InfoBlock market={market} type="deposit" />*/}
            <DepositWidget
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
            <BerachainTransactionDetails type="deposit" market={market} />
          </Box>
        )}
        {tab === 2 && (
          <WithdrawWidget
            market={market}
            chain={chain}
            overrideStyle={{ mainColor: '#FF8425' }}
            appLink={appLink}
            appName={appName}
          />
        )}
      </Box>
    </Box>
  );
};
