import type { FC, PropsWithChildren } from 'react';
import { SectionCardContainer } from './SectionCard.style';
import type { SxProps, Theme } from '@mui/material/styles';

interface SectionCardProp extends PropsWithChildren {
  sx?: SxProps<Theme>;
  id?: string;
}

export const SectionCard: FC<SectionCardProp> = ({ children, id, sx }) => {
  return (
    <SectionCardContainer id={id} sx={sx}>
      {children}
    </SectionCardContainer>
  );
};
