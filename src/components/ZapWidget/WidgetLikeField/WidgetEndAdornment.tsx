import {
  Avatar as MuiAvatar,
  Box,
  FormHelperText,
  InputLabel,
  Typography,
  useTheme,
  Grid,
  Link,
  Input,
} from '@mui/material';
import { MaxButton } from './WidgetLikeField.style';
import type { Dispatch, SetStateAction } from 'react';

interface WidgetFieldEndAdornmentProps {
  balance: string;
  mainColor?: string;
  setValue: Dispatch<SetStateAction<string>>;
}

function WidgetFieldEndAdornment({
  balance,
  mainColor,
  setValue,
}: WidgetFieldEndAdornmentProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MaxButton
        sx={{ p: '5px 10px', marginY: 1 }}
        aria-label="menu"
        mainColor={mainColor}
        onClick={() => setValue(balance ?? '0')}
      >
        max
      </MaxButton>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="bodyXSmall" color="textSecondary" component="span">
          /{' '}
          {Intl.NumberFormat('en-US', {
            notation: 'compact',
            useGrouping: true,
            minimumFractionDigits: 0,
            maximumFractionDigits: parseFloat(balance) > 1 ? 1 : 4,
          }).format(parseFloat(balance))}
        </Typography>
      </Box>
    </Box>
  );
}

export default WidgetFieldEndAdornment;
