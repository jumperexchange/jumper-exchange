'use client';
import Intercom, {
  boot,
  shutdown,
  update,
  show,
  onUnreadCountChange,
  hide,
} from '@intercom/messenger-js-sdk';
import { captureException } from '@sentry/nextjs';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import envConfig from 'src/config/env-config';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useMenuStore } from 'src/stores/menu';
import { fetchIntercomUserHash } from 'src/app/lib/useIntercomUserHash';

const commonIntercomConfig = {
  app_id: envConfig.NEXT_PUBLIC_INTERCOM_APP_ID,
  hide_default_launcher: true,
  alignment: 'right',
  hide_notifications: false,
};

export const IntercomProviderInner: FC<PropsWithChildren> = ({ children }) => {
  const activeAccount = useActiveAccountByChainType();
  const walletAddress = activeAccount?.address;
  const syncedAddressRef = useRef<string | undefined>(undefined);
  const fetchingAddressRef = useRef<string | undefined>(undefined);
  const openSupportModal = useMenuStore((state) => state.openSupportModal);
  const setOpenSupportModal = useMenuStore(
    (state) => state.setSupportModalState,
  );
  const setSupportModalUnreadCount = useMenuStore(
    (state) => state.setSupportModalUnreadCount,
  );

  useEffect(() => {
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID) {
      return;
    }

    Intercom({
      ...commonIntercomConfig,
    });
  }, []);

  useEffect(() => {
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID || !walletAddress) {
      if (!walletAddress) {
        syncedAddressRef.current = undefined;
      }
      return;
    }

    if (
      walletAddress === syncedAddressRef.current ||
      walletAddress === fetchingAddressRef.current
    ) {
      return;
    }

    const previousAddress = syncedAddressRef.current;
    fetchingAddressRef.current = walletAddress;

    void (async () => {
      try {
        if (previousAddress && previousAddress !== walletAddress) {
          hide();
          useMenuStore.getState().setSupportModalUnreadCount(0);
          shutdown();
          boot(commonIntercomConfig);
        }

        const { user_id, user_hash } =
          await fetchIntercomUserHash(walletAddress);

        update({
          user_id,
          user_hash,
        });

        syncedAddressRef.current = walletAddress;
      } catch (error) {
        captureException(error);
        console.error('Error updating Intercom session', error);
      } finally {
        if (fetchingAddressRef.current === walletAddress) {
          fetchingAddressRef.current = undefined;
        }
      }
    })();
  }, [walletAddress]);

  useEffect(() => {
    if (openSupportModal) {
      show();
      setOpenSupportModal(false);
    }
  }, [openSupportModal, setOpenSupportModal]);

  useEffect(() => {
    onUnreadCountChange((count: number) => {
      setSupportModalUnreadCount(count);
    });
  }, [setSupportModalUnreadCount]);

  return null;
};
