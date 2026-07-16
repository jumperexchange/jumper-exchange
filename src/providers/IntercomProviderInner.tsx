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
import { useIntercomUserHash } from 'src/app/lib/useIntercomUserHash';
import { usePrevious } from 'src/hooks/usePrevious';

const commonIntercomConfig = {
  app_id: envConfig.NEXT_PUBLIC_INTERCOM_APP_ID,
  hide_default_launcher: true,
  alignment: 'right',
  hide_notifications: false,
};

export const IntercomProviderInner: FC<PropsWithChildren> = () => {
  const activeAccount = useActiveAccountByChainType();
  const previousActiveAccount = usePrevious(activeAccount);
  const [
    pendingIntercomShow,
    clearPendingIntercomShow,
    setSupportModalUnreadCount,
  ] = useMenuStore((state) => [
    state.pendingIntercomShow,
    state.clearPendingIntercomShow,
    state.setSupportModalUnreadCount,
  ]);
  const { mutateAsync: getUserHash } = useIntercomUserHash();
  const unreadListenerRegisteredRef = useRef(false);
  const hasBootedRef = useRef(false);

  useEffect(() => {
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID || hasBootedRef.current) {
      return;
    }

    hasBootedRef.current = true;
    Intercom({
      ...commonIntercomConfig,
    });
  }, []);

  useEffect(() => {
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID || !pendingIntercomShow) {
      return;
    }

    show();
    clearPendingIntercomShow();
  }, [pendingIntercomShow, clearPendingIntercomShow]);

  useEffect(() => {
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID) {
      return;
    }

    const walletAddress = activeAccount?.address;

    const updateIntercomSession = async () => {
      try {
        if (
          previousActiveAccount?.address &&
          previousActiveAccount.address !== walletAddress
        ) {
          hide();
          setSupportModalUnreadCount(0);
          shutdown();
          boot(commonIntercomConfig);
        }

        if (walletAddress) {
          const userHash = await getUserHash(walletAddress);
          update({
            user_id: walletAddress,
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
    if (
      !envConfig.NEXT_PUBLIC_INTERCOM_APP_ID ||
      unreadListenerRegisteredRef.current
    ) {
      return;
    }

    onUnreadCountChange((count: number) => {
      setSupportModalUnreadCount(count);
    });
    unreadListenerRegisteredRef.current = true;
  }, [setSupportModalUnreadCount]);

  return null;
};
