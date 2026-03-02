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
import { useEffect } from 'react';
import envConfig from 'src/config/env-config';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useMenuStore } from 'src/stores/menu';
import { useIntercomUserHash } from 'src/app/lib/useIntercomUserHash';
import { usePrevious } from 'src/hooks/usePrevious';

const commonIntercomConfig = {
  app_id: envConfig.NEXT_PUBLIC_INTERCOM_APP_ID,
  hide_default_launcher: true,
  alignment: 'right',
  hide_notifications: false,
};

export const IntercomProviderInner: FC<PropsWithChildren> = ({ children }) => {
  const activeAccount = useActiveAccountByChainType();
  const previousActiveAccount = usePrevious(activeAccount);
  const [openSupportModal, setOpenSupportModal, setSupportModalUnreadCount] =
    useMenuStore((state) => [
      state.openSupportModal,
      state.setSupportModalState,
      state.setSupportModalUnreadCount,
    ]);
  const { mutateAsync: getUserHash } = useIntercomUserHash();

  useEffect(() => {
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID) {
      return;
    }

    Intercom({
      ...commonIntercomConfig,
    });
  }, []);

  useEffect(() => {
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID) {
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
        captureException(error);
        console.error('Error updating Intercom session', error);
      }
    };

    updateIntercomSession();
  }, [
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

  return null;
};
