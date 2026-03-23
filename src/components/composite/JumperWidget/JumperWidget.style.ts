import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { getTextEllipsisStyles } from '@/utils/styles/getTextEllipsisStyles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const Label = styled(Typography)(({ theme }) => ({
  ...theme.typography.title2XSmall,
}));

export const Placeholder = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyLarge,
  color: (theme.vars || theme).palette.textHint,
}));

export const Value = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyLargeStrong,
}));

export const fieldSx = (theme: Theme) => ({
  background: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  borderRadius: `${theme.shape.cardBorderRadiusMedium}px`,
  boxShadow: theme.shadows[2],
});

export const FieldWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  ...fieldSx(theme),
}));

export const MenuItemWrapper = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0, -1),
  borderRadius: theme.shape.radius8,
  gap: theme.spacing(2),
  ':last-child': {
    marginBottom: theme.spacing(-1),
  },
  '&:hover, &.Mui-selected:hover': {
    backgroundColor: (theme.vars || theme).palette.alpha100.main,
  },
  '&.Mui-selected': {
    backgroundColor: 'transparent',
  },
}));

export const MenuItemLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMedium,
  minWidth: 0,
  ...getTextEllipsisStyles(1),
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 0),
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));
