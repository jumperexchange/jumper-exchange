import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';

// `styled()` erases Autocomplete's generics; cast back so callers keep
// type-safe `options`/`value`/`onChange` for their option type.
export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => {
  const surfaceBorder = getSurfaceBorder(theme, 'surface1');
  return {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      padding: theme.spacing(0.75, 1.5),
      gap: theme.spacing(0.75),
      borderRadius: theme.shape.inputTextBorderRadius,
      backgroundColor: (theme.vars || theme).palette.surface1.main,
      border:
        surfaceBorder !== 'none'
          ? surfaceBorder
          : `1px solid ${(theme.vars || theme).palette.grey[100]}`,
      transition: 'border-color 0.2s ease-in-out',
      '&:hover, &:focus-within': {
        borderColor: (theme.vars || theme).palette.borderActive,
      },
      boxShadow: theme.shadows[2],
      '& fieldset': {
        border: 'none',
      },
      '& .MuiAutocomplete-input': {
        ...theme.typography.bodyMedium,
        padding: 0,
      },
      '& .MuiAutocomplete-input::placeholder': {
        ...theme.typography.bodyMedium,
        opacity: 1,
        color: (theme.vars || theme).palette.textHint,
      },
    },
  };
}) as typeof Autocomplete;

export const StyledOptionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
}));

export const StyledOptionLabel = styled(Typography)({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const StyledGroupHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: theme.spacing(1, 1.5, 0.5),
  color: (theme.vars || theme).palette.textHint,
  textTransform: 'uppercase',
  ...theme.typography.bodyXXSmallStrong,
}));

export const StyledGroupMoreCount = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyXXSmall,
  color: (theme.vars || theme).palette.textHint,
  textTransform: 'none',
}));

export const StyledGroupList = styled('ul')({
  padding: 0,
  margin: 0,
});

export const StyledTagContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}));
