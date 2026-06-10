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
import { useIntercomUserHash } from 'src/app/lib/useIntercomUserHash';
import envConfig from 'src/config/env-config';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { usePrevious } from 'src/hooks/usePrevious';
import { useMenuStore } from 'src/stores/menu';

const commonIntercomConfig = {
  app_id: envConfig.NEXT_PUBLIC_INTERCOM_APP_ID,
  hide_default_launcher: true,
  alignment: 'right',
  hide_notifications: false,
};

export const IntercomProviderInner: FC<PropsWithChildren> = ({ children }) => {
  const activeAccount = useActiveAccountByChainType();
  const walletAddress = activeAccount?.address;
  const previousAddress = usePrevious(walletAddress);
  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    variables: syncedAddress,
  } = useIntercomUserHash();
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
    if (!envConfig.NEXT_PUBLIC_INTERCOM_APP_ID) {
      return;
    }

    if (
      (isPending || isSuccess || isError) &&
      syncedAddress === walletAddress
    ) {
      return;
    }

    if (previousAddress !== undefined && previousAddress !== walletAddress) {
      hide();
      setSupportModalUnreadCount(0);
      shutdown();
      boot(commonIntercomConfig);
    }

    mutate(walletAddress, {
      onSuccess: ({ user_id, user_hash }) => {
        update({ user_id, user_hash });
      },
      onError: (error) => {
        captureException(error);
        console.error('Error updating Intercom session', error);
      },
    });
  }, [
    walletAddress,
    previousAddress,
    mutate,
    isPending,
    isSuccess,
    isError,
    syncedAddress,
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
