import { FC, PropsWithChildren } from 'react';
import { SectionCardContainer } from './SectionCard.style';

interface SectionCardProp extends PropsWithChildren {}

export const SectionCard: FC<SectionCardProp> = ({ children }) => {
  return <SectionCardContainer>{children}</SectionCardContainer>;
};
