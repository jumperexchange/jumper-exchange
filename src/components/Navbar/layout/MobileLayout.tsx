'use client';

import type { FC } from 'react';

import { SecondaryLinksContainer } from './Layout.styles';
import { MainMenuToggle } from '../components/Buttons/MainMenuToggle';
import type { LayoutVariantProps } from './Layout.types';

export const MobileLayout: FC<LayoutVariantProps> = ({ secondaryButtons }) => {
  return (
    <SecondaryLinksContainer>
      {secondaryButtons} <MainMenuToggle />
    </SecondaryLinksContainer>
  );
};
