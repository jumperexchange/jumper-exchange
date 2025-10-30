import { FC } from 'react';

import Box from '@mui/material/Box';
import { MainLinksContainer, SecondaryLinksContainer } from './Layout.styles';
import { useMainLinks } from '../hooks';
import { LabelButton } from '../components/Buttons/LabelButton';
import { MainMenuToggle } from '../components/Buttons/MainMenuToggle';
import { LayoutVariantProps } from './Layout.types';

export const DesktopLayout: FC<LayoutVariantProps> = ({ secondaryButtons }) => {
  const { links, activeLink } = useMainLinks();

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
        <MainMenuToggle />
      </SecondaryLinksContainer>
    </>
  );
};
