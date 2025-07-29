import { FC, PropsWithChildren } from 'react';
import { SectionCardContainer } from './SectionCard.style';
import { SxProps, Theme } from '@mui/material/styles';

interface SectionCardProp extends PropsWithChildren {
  sx?: SxProps<Theme>;
}

export const SectionCard: FC<SectionCardProp> = ({ children, sx }) => {
  return <SectionCardContainer sx={sx}>{children}</SectionCardContainer>;
};
