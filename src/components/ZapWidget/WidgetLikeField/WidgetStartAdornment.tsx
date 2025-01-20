import { Box, Typography } from '@mui/material';

interface WidgetFieldStartAdornmentProps {
  image: React.ReactNode;
  tokenUSDAmount?: string;
}

function WidgetFieldStartAdornment({
  image,
  tokenUSDAmount,
}: WidgetFieldStartAdornmentProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: 'auto',
      }}
    >
      {image}
    </Box>
  );
}

export default WidgetFieldStartAdornment;
