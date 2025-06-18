import { ButtonSecondary } from '@/components/Button/Button.style';
import { Typography } from '@mui/material';
import type { MenuItemProps } from './MenuItem.types';

export const MenuItemButton = ({
  label,
  prefixIcon,
  suffixIcon,
}: Pick<MenuItemProps, 'label' | 'prefixIcon' | 'suffixIcon'>) => (
  <ButtonSecondary fullWidth>
    {prefixIcon}
    <Typography
      variant="bodyMediumStrong"
      component="span"
      ml={prefixIcon ? '9.5px' : undefined}
      mr={prefixIcon ? '9.5px' : undefined}
      sx={(theme) => ({
        color: (theme.vars || theme).palette.white.main,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 208,
        [theme.breakpoints.up('sm')]: {
          maxWidth: 168,
        },
        ...theme.applyStyles('light', {
          color: (theme.vars || theme).palette.primary.main,
        }),
      })}
    >
      {label}
    </Typography>
    {suffixIcon}
  </ButtonSecondary>
);
