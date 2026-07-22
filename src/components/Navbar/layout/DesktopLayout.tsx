import type { FC } from 'react';

import Box from '@mui/material/Box';
import { MainLinksContainer, SecondaryLinksContainer } from './Layout.styles';
import { useMainLinks } from '../hooks';
import { LabelButton } from '../components/Buttons/LabelButton';
import { MainMenuToggle } from '../components/Buttons/MainMenuToggle';
import type { LayoutVariantProps } from './Layout.types';
import { NotificationBell } from '@/components/Notifications/NotificationBell';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';

export const DesktopLayout: FC<LayoutVariantProps> = ({ secondaryButtons }) => {
  const { links, activeLink } = useMainLinks();

  const notificationsFlag = useABTest({ feature: AB_TEST_NAME.NOTIFICATIONS });

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
        {notificationsFlag.isEnabled && <NotificationBell />}
        <MainMenuToggle />
      </SecondaryLinksContainer>
    </>
  );
};
