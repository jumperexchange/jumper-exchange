import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Breakpoint } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import { MenuLabel } from '.';

interface MenuItemLabelProps {
  showMoreIcon?: boolean;
  label?: string;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
}

export const MenuItemLabel = ({
  showMoreIcon = true,
  label,
  prefixIcon,
  suffixIcon,
}: MenuItemLabelProps) => {
  const theme = useTheme();

  return (
    <>
      <MenuLabel
        variant={
          suffixIcon && showMoreIcon
            ? 'xs'
            : !suffixIcon && !showMoreIcon
              ? 'lg'
              : 'md'
        }
      >
        {prefixIcon ?? null}
        {label ? (
          <Typography
            variant={'bodyMedium'}
            ml={theme.spacing(1.5)}
            sx={[
              {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              prefixIcon
                ? {
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      maxWidth: 188,
                    },
                  }
                : {
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      maxWidth: 'inherit',
                    },
                  },
            ]}
          >
            {label}
          </Typography>
        ) : null}
      </MenuLabel>
      {suffixIcon || showMoreIcon ? (
        <div
          style={{
            display: suffixIcon || showMoreIcon ? 'flex' : 'none',
            alignItems: 'center',
          }}
        >
          {suffixIcon ?? null}
          {showMoreIcon ? (
            <ChevronRightIcon sx={{ ml: theme.spacing(1) }} />
          ) : null}
        </div>
      ) : null}
    </>
  );
};
