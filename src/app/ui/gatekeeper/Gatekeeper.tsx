'use client';

import { GatekeeperStatus, useGatekeeperStatus } from './useGatekeeperStatus';
import { GatekeeperOverlayLayout } from './GatekeeperOverlayLayout';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@/components/ConnectButton';
import type { GatekeeperIllustrations } from './types';
import { GatekeeperRequestAccessLink, LoadingButton } from './Gatekeeper.style';

interface GatekeeperProps extends React.PropsWithChildren {
  flag: 'hasEarn';
  pageTitle: string;
  illustrations: GatekeeperIllustrations;
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({
  children,
  flag,
  pageTitle,
  illustrations,
}) => {
  const { status, error } = useGatekeeperStatus(flag);
  const { t } = useTranslation();

  if (status === GatekeeperStatus.LOADING) {
    return (
      <GatekeeperOverlayLayout
        title={t('gatekeeper.title', { pageTitle })}
        subtitle={t('gatekeeper.subtitle.notConnected')}
        illustrations={illustrations}
      >
        <LoadingButton disabled>Loading...</LoadingButton>
      </GatekeeperOverlayLayout>
    );
  }

  if (status === GatekeeperStatus.REQUIRES_CONNECT) {
    return (
      <GatekeeperOverlayLayout
        title={t('gatekeeper.title', { pageTitle })}
        subtitle={t('gatekeeper.subtitle.notConnected')}
        illustrations={illustrations}
      >
        <ConnectButton />
      </GatekeeperOverlayLayout>
    );
  }

  if (status === GatekeeperStatus.LOADING_NFT) {
    return (
      <GatekeeperOverlayLayout
        title={t('gatekeeper.title', { pageTitle })}
        subtitle={t('gatekeeper.subtitle.notConnected')}
        illustrations={illustrations}
      >
        <LoadingButton disabled>Loading NFT...</LoadingButton>
      </GatekeeperOverlayLayout>
    );
  }

  if (status === GatekeeperStatus.ERROR) {
    return (
      <GatekeeperOverlayLayout
        title={t('gatekeeper.title', { pageTitle })}
        subtitle={t('gatekeeper.subtitle.notConnected')}
        illustrations={illustrations}
      >
        <pre>Error: {error?.toString()}</pre>
      </GatekeeperOverlayLayout>
    );
  }

  if (status === GatekeeperStatus.NOT_ALLOWED) {
    return (
      <GatekeeperOverlayLayout
        title={t('gatekeeper.title', { pageTitle })}
        subtitle={t('gatekeeper.subtitle.noAccess')}
        illustrations={illustrations}
      >
        <GatekeeperRequestAccessLink
          href="/"
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
