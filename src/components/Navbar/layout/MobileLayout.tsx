'use client';

import type { FC } from 'react';

import { NotificationBell } from '@/components/Notifications/NotificationBell';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { SecondaryLinksContainer } from './Layout.styles';
import { MainMenuToggle } from '../components/Buttons/MainMenuToggle';
import type { LayoutVariantProps } from './Layout.types';

export const MobileLayout: FC<LayoutVariantProps> = ({ secondaryButtons }) => {
  const notificationsFlag = useABTest({ feature: AB_TEST_NAME.NOTIFICATIONS });

  return (
    <SecondaryLinksContainer>
      {secondaryButtons}
      {notificationsFlag.isEnabled && <NotificationBell />}
      <MainMenuToggle />
    </SecondaryLinksContainer>
  );
};
