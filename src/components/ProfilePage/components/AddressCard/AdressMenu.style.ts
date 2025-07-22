'use client';

import { styled } from '@mui/material/styles';
import { MenuList } from 'src/components/Menu/Menu.style';

export const AddressMenuList = styled(MenuList)(() => ({
  ':first-child': {
    marginTop: '16px',
  },
  'li:last-of-type': {
    marginBottom: '16px',
  },
}));
