'use client';

import type { FC } from 'react';

import { NotificationBell } from '@/components/Notifications/NotificationBell';
import {
  GatekeeperStatus,
  useGatekeeperStatus,
} from '@/app/ui/gatekeeper/useGatekeeperStatus';
import { SecondaryLinksContainer } from './Layout.styles';
import { MainMenuToggle } from '../components/Buttons/MainMenuToggle';
import type { LayoutVariantProps } from './Layout.types';

export const MobileLayout: FC<LayoutVariantProps> = ({ secondaryButtons }) => {
  const { status } = useGatekeeperStatus('hasNotifications');

  return (
    <SecondaryLinksContainer>
      {secondaryButtons}
      {status === GatekeeperStatus.SUCCESS && <NotificationBell />}
      <MainMenuToggle />
    </SecondaryLinksContainer>
  );
};
