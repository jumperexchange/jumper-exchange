'use client';

import { useMenuStore } from '@/stores/menu';
import { hide, Intercom, onHide, show } from '@intercom/messenger-js-sdk';
import { useAccount } from '@lifi/wallet-management';
import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { ButtonPrimary } from '../Button';
import { SupportLink } from './Support.style';
import { SupportMuiModal } from './SupportModal.style';

const DISCORD_SUPPORT_URL = 'https://discord.gg/jumperexchange';

export const Support = () => {
  const theme = useTheme();
  const { account } = useAccount();
  const [openSupportModal, setSupportModalState] = useMenuStore((state) => [
    state.openSupportModal,
    state.setSupportModalState,
  ]);

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
          action_color: theme.palette.primary.main, // theme.vars is not accessible in iframe
          background_color: theme.palette.surface1.main,
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

  onHide(() => {
    setSupportModalState(false);
  });

  useEffect(() => {
    if (openSupportModal) {
      console.log('Showing Intercom');
      show();
    }
  }, [openSupportModal]);

  const handleClose = () => {
    try {
      hide();
    } catch (error) {
      console.error('Error hiding Intercom:', error);
    }
    setSupportModalState(false);
  };

  return (
    <SupportMuiModal open={openSupportModal} onClose={handleClose}>
      <SupportLink href={DISCORD_SUPPORT_URL} target="_blank">
        <ButtonPrimary component={'span'}>Get support on Discord</ButtonPrimary>
      </SupportLink>
    </SupportMuiModal>
  );
};
