'use client';

import { useMenuStore } from '@/stores/menu';
import { Intercom, show } from '@intercom/messenger-js-sdk';
import { useAccount } from '@lifi/wallet-management';
import { useTheme } from '@mui/material';
import { useEffect } from 'react';

const DISCORD_SUPPORT_URL = 'https://discord.gg/jumperexchange';

export const Support = () => {
  const theme = useTheme();
  const { account } = useAccount();
  const [openSupportModal] = useMenuStore((state) => [state.openSupportModal]);

  // Initialize Intercom only once
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_INTERCOM_API_KEY) {
      try {
        Intercom({
          name: 'JumperExchange_Intercom',
          app_id: process.env.NEXT_PUBLIC_INTERCOM_API_KEY,
          custom_launcher_selector: 'intercom-support',
          ...(account && account.address && { user_id: account.address }),
          alignment: 'right',
          hide_default_launcher: true,
        });
        console.log('Intercom initialized successfully');
      } catch (error) {
        console.error('Error initializing Intercom:', error);
      }
    } else {
      console.warn('Intercom API key not found');
    }
  }, [account, theme]);

  useEffect(() => {
    if (openSupportModal) {
      console.log('Showing Intercom');
      show();
    }
  }, [openSupportModal]);

  return null;
};
