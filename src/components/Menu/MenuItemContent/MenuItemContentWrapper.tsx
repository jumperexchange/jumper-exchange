import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import type { FC, PropsWithChildren } from 'react';

interface MenuItemContentWrapperProps extends PropsWithChildren {
  styles?: SxProps<Theme>;
}

export const MenuItemContentWrapper: FC<MenuItemContentWrapperProps> = ({
  children,
  styles,
}) => {
  return (
    <Stack
      direction="row"
      sx={[
        {
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        },
        ...(Array.isArray(styles) ? styles : [styles]),
      ]}
    >
      {children}
    </Stack>
  );
};
