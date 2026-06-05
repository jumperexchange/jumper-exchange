'use client';

import { ConnectButton } from '@/components/ConnectButton';
import { useTranslation } from 'react-i18next';
import { GatekeeperRequestAccessLink, LoadingButton } from './Gatekeeper.style';
import { GatekeeperOverlayLayout } from './GatekeeperOverlayLayout';
import type { GatekeeperIllustrations } from './types';
import { GatekeeperStatus, useGatekeeperStatus } from './useGatekeeperStatus';
import { useMenuStore } from '@/stores/menu/MenuStore';
import { useEffect } from 'react';
import { GATEKEEPER_REQUEST_ACCESS_URL } from '@/const/urls';

interface GatekeeperProps extends React.PropsWithChildren {
  flag: 'hasEarn';
  pageTitle: string;
  illustrations: GatekeeperIllustrations;
  subtitleIntroKey: 'earn' | 'portfolio';
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({
  children,
  flag,
  pageTitle,
  illustrations,
  subtitleIntroKey,
}) => {
  const { status, error } = useGatekeeperStatus(flag);

  const { t } = useTranslation();
  const setSnackbarState = useMenuStore((state) => state.setSnackbarState);

  useEffect(() => {
    if (status === GatekeeperStatus.ERROR) {
      setSnackbarState(
        true,
        error?.toString() || t('gatekeeper.error'),
        'error',
      );
    }
  }, [status, setSnackbarState, t, error]);

  const title = t('gatekeeper.title', { pageTitle });
  const subtitleIntro = t(`gatekeeper.subtitle.intro.${subtitleIntroKey}`);
  const notConnectedSubtitle = t('gatekeeper.subtitle.notConnected');
  const noAccessSubtitle = t('gatekeeper.subtitle.noAccess');

  if (status === GatekeeperStatus.REQUIRES_CONNECT) {
    return (
      <GatekeeperOverlayLayout
        title={title}
        subtitleIntro={subtitleIntro}
        subtitle={notConnectedSubtitle}
        illustrations={illustrations}
      >
        <ConnectButton />
      </GatekeeperOverlayLayout>
    );
  }

  if (status === GatekeeperStatus.LOADING_ACCESS) {
    return (
      <GatekeeperOverlayLayout
        title={title}
        subtitleIntro={subtitleIntro}
        subtitle={notConnectedSubtitle}
        illustrations={illustrations}
      >
        <LoadingButton disabled>{t('gatekeeper.connecting')}</LoadingButton>
      </GatekeeperOverlayLayout>
    );
  }

  if (
    status === GatekeeperStatus.NOT_ALLOWED ||
    status === GatekeeperStatus.ERROR
  ) {
    return (
      <GatekeeperOverlayLayout
        title={title}
        subtitleIntro={subtitleIntro}
        subtitle={noAccessSubtitle}
        illustrations={illustrations}
      >
        <GatekeeperRequestAccessLink
          href={GATEKEEPER_REQUEST_ACCESS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('gatekeeper.requestAccess')}
        </GatekeeperRequestAccessLink>
      </GatekeeperOverlayLayout>
    );
  }

  return <>{children}</>;
};
