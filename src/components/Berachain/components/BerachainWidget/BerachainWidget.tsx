import { Box, useTheme } from '@mui/material';
import { useState } from 'react';
import { type TabProps, Tabs } from 'src/components/Tabs/Tabs';
import { Widget } from 'src/components/Widgets/Widget';
import { BerachainWidgetWip } from '../BerachainWidgetWip/BerachainWidgetWip';
import WidgetLikeField from '@/components/WidgetLikeField/WidgetLikeField';

export const BerachainWidget = () => {
  const [tab, setTab] = useState(0);
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
      {tab === 0 ? (
        <Box sx={{ marginTop: theme.spacing(1.5) }}>
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
      ) : null}
      {tab === 1 ? (
        <Box sx={{ marginTop: theme.spacing(1.5) }}>
          <Widget starterVariant={'refuel'} autoHeight={true} />
        </Box>
      ) : null}
      {tab === 2 ? (
        <Box sx={{ marginTop: theme.spacing(1.5) }}>
          <Widget starterVariant={'custom'} />
        </Box>
      ) : null}
    </Box>
  );
};
