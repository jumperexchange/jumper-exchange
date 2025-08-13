'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Portal from '@mui/material/Portal';

import {
  FloatingMainLinksContainer,
  SecondaryLinksContainer,
} from './Layout.styles';
import { MainMenuToggle } from '../components/Buttons/MainMenuToggle';
import { useMainLinks } from '../hooks';
import { HorizontalTabs } from 'src/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from 'src/components/HorizontalTabs/HorizontalTabs.style';
import { LayoutVariantProps } from './Layout.types';

export const MobileLayout: FC<LayoutVariantProps> = ({ secondaryButtons }) => {
  const { links, activeLink } = useMainLinks();
  const router = useRouter();
  const onChange = (_: React.SyntheticEvent, newValue: string) => {
    const activeLink = links.find(({ value }) => value === newValue);
    if (activeLink) {
      router.push(activeLink.value);
    }
  };
  return (
    <>
      <SecondaryLinksContainer>{secondaryButtons}</SecondaryLinksContainer>
      <Portal>
        <FloatingMainLinksContainer direction="row">
          <HorizontalTabs
            tabs={links}
            onChange={onChange}
            value={activeLink?.value}
            sx={{
              backgroundColor: 'transparent !important',
              width: '100%',
              '&.MuiTabs-root': {
                padding: 0,
              },
              '& .MuiTabs-scroller': {
                overflow: 'unset !important',
              },
              '&.MuiTabs-root .MuiTab-root': {
                backgroundColor: 'transparent',
                width: '100%',
                maxWidth: '100%',
              },
            }}
            size={HorizontalTabSize.LG}
            autoSelectFirst={false}
            syncWithValue
          />
          <MainMenuToggle />
        </FloatingMainLinksContainer>
      </Portal>
    </>
  );
};
