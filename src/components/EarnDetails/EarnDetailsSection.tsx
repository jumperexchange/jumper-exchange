'use client';

import { PropsWithChildren } from 'react';
import { SectionCardContainer } from '../Cards/SectionCard/SectionCard.style';

export const EarnDetailsSection = ({ children }: PropsWithChildren) => {
  return (
    <SectionCardContainer
      sx={(theme) => ({
        gap: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {children}
    </SectionCardContainer>
  );
};
