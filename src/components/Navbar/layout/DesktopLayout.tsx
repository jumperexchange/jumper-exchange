import type { FC } from 'react';

import Box from '@mui/material/Box';
import { MainLinksContainer, SecondaryLinksContainer } from './Layout.styles';
import { useMainLinks } from '../hooks';
import { LabelButton } from '../components/Buttons/LabelButton';
import { MainMenuToggle } from '../components/Buttons/MainMenuToggle';
import type { LayoutVariantProps } from './Layout.types';
import { NotificationBell } from '@/components/Notifications/NotificationBell';
import {
  GatekeeperStatus,
  useGatekeeperStatus,
} from '@/app/ui/gatekeeper/useGatekeeperStatus';

export const DesktopLayout: FC<LayoutVariantProps> = ({ secondaryButtons }) => {
  const { links, activeLink } = useMainLinks();

  const { status } = useGatekeeperStatus('hasNotifications');

  return (
    <>
      <MainLinksContainer sx={{ width: '100%', mr: 1 }}>
        {links.map((link) => (
          <LabelButton
            isActive={activeLink?.value === link.value}
            key={link.value}
            href={link.value}
            data-testid={link.testId}
            label={
              <Box component="span" sx={{ paddingX: 1.5 }}>
                {link.label}
              </Box>
            }
          />
        ))}
      </MainLinksContainer>

      <SecondaryLinksContainer>
        {secondaryButtons}
        {status === GatekeeperStatus.SUCCESS && <NotificationBell />}
        <MainMenuToggle />
      </SecondaryLinksContainer>
    </>
  );
};
