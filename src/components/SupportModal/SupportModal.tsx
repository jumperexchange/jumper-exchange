'use client';

import { HeaderHeight } from '@/const/headerHeight';
import { useMenuStore } from '@/stores/menu';
import { hide, Intercom, onHide, show } from '@intercom/messenger-js-sdk';
import { useAccount } from '@lifi/wallet-management';
import { useTheme } from '@mui/material';
import WidgetBot from '@widgetbot/react-embed';
import { useEffect, useState } from 'react';
import { Modal, SupportModalContainer } from './SupportModal.style';

export const SupportModal = () => {
  const theme = useTheme();
  const { account } = useAccount();
  const [openSupportModal, setSupportModalState] = useMenuStore((state) => [
    state.openSupportModal,
    state.setSupportModalState,
  ]);
  const [isIntercomLoaded, setIsIntercomLoaded] = useState(false);
  const [isDiscordSupport, setIsDiscordSupport] = useState(false);

  // Initialize Intercom only once
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_INTERCOM_API_KEY) {
      Intercom({
        name: 'JumperExchange_Intercom',
        company: {
          company_id: process.env.NEXT_PUBLIC_ENVIRONMENT,
          name: process.env.NEXT_PUBLIC_SITE_URL,
        },
        app_id: process.env.NEXT_PUBLIC_INTERCOM_API_KEY,
        ...(account && account.address && { user_id: account.address }),
        background_color: (theme.vars || theme).palette.surface1.main,
        action_color: (theme.vars || theme).palette.primary.main,
        hide_default_launcher: true,
        alignment: 'right',
      });
    }
  }, []);

  onHide(() => {
    setSupportModalState(false);
  });

  useEffect(() => {
    if (!openSupportModal) {
      setIsIntercomLoaded(false);
      setIsDiscordSupport(false);
      return;
    }

    // Add a small delay before showing the widget
    const intercomQueue = setTimeout(() => {
      setIsDiscordSupport(true);
    }, 500); // 500ms delay

    // Function to check for Intercom container
    const checkIntercomStatus = () => {
      const isIntercomContainerLoaded = !!document.querySelector(
        '#intercom-container',
      );
      if (isIntercomContainerLoaded) {
        setIsIntercomLoaded(true);
        setIsDiscordSupport(false); // Hide widget if Intercom is loaded
        return true;
      }
      return false;
    };

    // Initial check
    if (!checkIntercomStatus()) {
      const intervalId = setInterval(() => {
        if (checkIntercomStatus()) {
          clearInterval(intervalId);
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
        clearTimeout(intercomQueue);
      };
    }

    return () => clearTimeout(intercomQueue);
  }, [openSupportModal]);

  useEffect(() => {
    if (openSupportModal) {
      show();
    }
  }, [openSupportModal, isIntercomLoaded]);

  const handleClose = () => {
    if (isIntercomLoaded) {
      hide();
    }
    setSupportModalState(false);
  };

  return (
    <Modal open={openSupportModal} onClose={handleClose}>
      <SupportModalContainer>
        {isDiscordSupport && !isIntercomLoaded && (
          <WidgetBot
            server="849912621360218112"
            channel="1108568727148056646" // #🩹︱web-support
            shard="https://emerald.widgetbot.io"
            style={{
              width: '100%',
              height: '80vh',
              maxHeight: `calc( 100vh - ${HeaderHeight.XS} )`,
              [`@media (minWidth: ${theme.breakpoints.values.sm}px)`]: {
                maxHeight: `calc( 100vh - ${HeaderHeight.SM} )`,
              },
              [`@media (minWidth:${theme.breakpoints.values.md}px)`]: {
                height: 500,
              },
            }}
          />
        )}
      </SupportModalContainer>
    </Modal>
  );
};
