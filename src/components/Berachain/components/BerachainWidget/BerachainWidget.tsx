import { Box, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { type TabProps, Tabs } from 'src/components/Tabs/Tabs';
import { Widget } from 'src/components/Widgets/Widget';
import { BerachainWidgetWip } from '../BerachainWidgetWip/BerachainWidgetWip';
import WidgetLikeField from '@/components/WidgetLikeField/WidgetLikeField';
import { EnrichedMarketDataType } from 'royco/queries';
import { formatDuration } from 'date-fns';
import {
  BerachainWidgetSelection,
  BerachainWidgetSelectionRewards,
} from '@/components/Berachain/components/BerachainWidgetWip/BerachainWidgetWip.style';
import { BerachainProgressCard } from '@/components/Berachain/components/BerachainProgressCard/BerachainProgressCard';
import { useTranslation } from 'react-i18next';
import { secondsToDuration } from '@/components/Berachain/lockupTimeMap';
import { useActiveMarket } from '@/components/Berachain/hooks/useActiveMarket';
import { useConfig, useReadContract, useReadContracts } from 'wagmi';

export const BerachainWidget = ({ market }: { market: EnrichedMarketDataType }) => {
  const [tab, setTab] = useState(1);
  const { t } = useTranslation();
  const theme = useTheme();

  const token = useMemo(() => {
    return market.input_token_data;
  }, [market?.input_token_data])

  const s = useConfig();


  console.log('config', s)

  const {
    isLoading,
    marketMetadata,
    currentMarketData,
    previousMarketData,
    propsReadMarket,
    propsActionsDecoderEnterMarket,
    propsActionsDecoderExitMarket,
  } = useActiveMarket(market.chain_id, market.market_type, market.market_id);

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

  const InfoBlock = () => (
    <BerachainWidgetSelection>
      <BerachainWidgetSelectionRewards>
        <BerachainProgressCard
          title="APY"
          value={market.native_annual_change_ratio ? t('format.percent', { value: market.native_annual_change_ratio }) : 'N/A'}
          tooltip={'APY lorem ipsum tooltip msg'}
        />
        {market.lockup_time === '0' ?
          <BerachainProgressCard
            title="TVL"
            value={market.locked_quantity_usd ? t('format.currency', { value: market.locked_quantity_usd, notation: 'compact' }) : 'N/A'}
            tooltip={'Rewards lorem ipsum tooltip msg'}
          />
        : <BerachainProgressCard
          title="Lockup time"
          value={formatDuration(
            Object.entries(
              secondsToDuration(market.lockup_time)
            )
              .filter(([_, value]) => value > 0) // Filter out zero values
              .slice(0, 2) // Take the first two non-zero units
              .reduce(
                (acc, [unit, value]) => ({ ...acc, [unit]: value }),
                {}
              )
          )}
          tooltip={'Rewards lorem ipsum tooltip msg'}
        />}
      </BerachainWidgetSelectionRewards>
    </BerachainWidgetSelection>
  )

  return (
    <Box
      sx={{
        padding: theme.spacing(3, 1),
        borderRadius: '24px',
        backgroundColor: '#121214',
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
      {tab === 0 && (
        <Box sx={{ marginTop: theme.spacing(1.5) }}>
          <Widget starterVariant="default" toChain={token?.chain_id} toToken={token?.contract_address} />
          <WidgetLikeField
            contractCalls={[
              {
                label: 'Approve',
                type: 'sign',
                message: 'test',
                onVerify: async (arg) => {
                  // Do something
                  await new Promise(resolve => setTimeout(resolve, 4000));

                  return true;
                }
              },
              {
                label: 'Withdraw',
                type: 'send',
                data: '',
                onVerify: (arg) => {
                  return Promise.resolve(true);
                }
              }
            ]}
            overrideStyle={{ mainColor: '#FF8425' }}
            label="Withdraw"
            placeholder="Enter the amount"
            hasMaxButton={true}
            helperText={{
              left: 'I am a left test',
              right: 'I am a right test',
            }}
            image={{
              url: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
              name: 'theter',
              badge: {
                url: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                name: 'ff'
              }
          }}
          />
          <BerachainWidgetWip />
        </Box>
      )}
      {tab === 1 && (
        <Box sx={{ marginTop: theme.spacing(1.5) }}>
          <InfoBlock />
          <Widget starterVariant={'refuel'} autoHeight={true} />
        </Box>
      )}
      {tab === 2 && (
        <Box sx={{ marginTop: theme.spacing(1.5) }}>
          <InfoBlock />
          <Widget starterVariant={'custom'} />
        </Box>
      )}
    </Box>
  );
};
