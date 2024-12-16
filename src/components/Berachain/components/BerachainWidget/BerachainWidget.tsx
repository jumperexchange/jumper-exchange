import { Box, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { type TabProps, Tabs } from 'src/components/Tabs/Tabs';
import { Widget } from 'src/components/Widgets/Widget';
import { BerachainWidgetWip } from '../BerachainWidgetWip/BerachainWidgetWip';
import type { EnrichedMarketDataType } from 'royco/queries';
import { useTranslation } from 'react-i18next';
import BerachainTransactionDetails
  from '@/components/Berachain/components/BerachainTransactionDetails/BerachainTransactionDetails';
import InfoBlock from '@/components/Berachain/components/BerachainWidget/InfoBlock';
import { useAccountBalance } from 'royco/hooks';
import { useAccount } from '@lifi/wallet-management';
import { parseRawAmountToTokenAmount } from 'royco/utils';
import { WithdrawWidget } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget';
import DepositWidget from '@/components/Berachain/components/BerachainWidget/DepositWidget/DepositWidget';

export const BerachainWidget = ({
  market,
}: {
  market: EnrichedMarketDataType;
}) => {
  const [tab, setTab] = useState(1);
  const { t } = useTranslation();
  const theme = useTheme();

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
      label: `Get ${token.name}`,
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

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('market', market);
  return (
    <Box
      sx={{
        padding: theme.spacing(1),
        borderRadius: '24px',
        backgroundColor: '#121214',
        boxShadow:
          theme.palette.mode === 'light'
            ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
            : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
      }}
    >
      <Typography variant="h2" color="text.primary" sx={{ mb: 3 }}>
        {market.name}
      </Typography>
      <Tabs
        data={tabs}
        value={tab}
        ariaLabel="zap-switch-tabs"
        containerStyles={containerStyles}
        tabStyles={tabStyles}
      />
      <Box sx={{
        maxWidth: '432px',
      }}>
        {tab === 0 && (
          <Box sx={{ marginTop: theme.spacing(1.5) }}>
            <Widget
              starterVariant="compact"
              toChain={token?.chain_id}
              toToken={token?.contract_address}
            />
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ marginTop: theme.spacing(1.5) }}>
            <InfoBlock market={market} />
            <BerachainTransactionDetails type="deposit" market={market} />
            <DepositWidget
              market={market}
              contractCalls={[]}
              overrideStyle={{ mainColor: '#FF8425' }}
              label="Supply"
              placeholder="Enter the amount"
              image={{
                url: market.input_token_data.image,
                name: market.input_token_data.name,
                badge: {
                  url: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                  name: 'Ethereum',
                },
              }}
            />
          </Box>
        )}
        {tab === 2 && <WithdrawWidget market={market} />}
      </Box>
    </Box>
  );
};
