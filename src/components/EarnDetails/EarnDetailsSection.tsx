'use client';

import type { PropsWithChildren } from 'react';
import { SectionCardContainer } from '../Cards/SectionCard/SectionCard.style';

export const EarnDetailsSection = ({ children }: PropsWithChildren) => {
  console.log('30. EarnDetailsSection');

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
