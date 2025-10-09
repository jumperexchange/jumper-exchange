'use client';

import { PropsWithChildren } from 'react';
import { SectionCardContainer } from '../Cards/SectionCard/SectionCard.style';

export const EarnDetailsSection = ({ children }: PropsWithChildren) => {
  return <SectionCardContainer>{children}</SectionCardContainer>;
};
