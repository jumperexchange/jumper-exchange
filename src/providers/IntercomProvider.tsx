'use client';
import Intercom, {
  boot,
  shutdown,
  update,
  show,
  onUnreadCountChange,
  hide,
} from '@intercom/messenger-js-sdk';
import * as Sentry from '@sentry/nextjs';
import { FC, PropsWithChildren, useEffect } from 'react';
import envConfig from 'src/config/env-config';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useHydrated } from 'src/hooks/useHydrated';
import { useMenuStore } from 'src/stores/menu';
import { useIntercomUserHash } from 'src/app/lib/useIntercomUserHash';
import { usePrevious } from 'src/hooks/usePrevious';

const commonIntercomConfig = {
  app_id: envConfig.NEXT_PUBLIC_INTERCOM_APP_ID,
  hide_default_launcher: true,
  alignment: 'right',
  hide_notifications: false,
};

export const IntercomProvider: FC<PropsWithChildren> = ({ children }) => {
  const activeAccount = useActiveAccountByChainType();
  const previousActiveAccount = usePrevious(activeAccount);
  const hydrated = useHydrated();
  const [openSupportModal, setOpenSupportModal, setSupportModalUnreadCount] =
    useMenuStore((state) => [
      state.openSupportModal,
      state.setSupportModalState,
      state.setSupportModalUnreadCount,
    ]);
  const { mutateAsync: getUserHash } = useIntercomUserHash();

  useEffect(() => {
    if (!hydrated || !envConfig.NEXT_PUBLIC_INTERCOM_APP_ID) {
      return;
    }

    try {
      Intercom({
        ...commonIntercomConfig,
      });
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error initializing Intercom', error);
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || !envConfig.NEXT_PUBLIC_INTERCOM_APP_ID) {
      return;
    }

    const updateIntercomSession = async () => {
      try {
        if (
          previousActiveAccount?.address &&
          previousActiveAccount.address !== activeAccount?.address
        ) {
          hide();
          setSupportModalUnreadCount(0);
          shutdown();
          boot(commonIntercomConfig);
        }
        if (activeAccount?.address) {
          const userHash = await getUserHash(activeAccount.address);
          update({
            user_id: activeAccount.address,
            user_hash: userHash,
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error updating Intercom session', error);
      }
    };

    updateIntercomSession();
  }, [
    hydrated,
    activeAccount?.address,
    previousActiveAccount?.address,
    getUserHash,
    setSupportModalUnreadCount,
  ]);

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

  return <>{children}</>;
};
