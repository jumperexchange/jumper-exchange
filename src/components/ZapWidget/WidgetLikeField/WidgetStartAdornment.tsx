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
      <Box sx={{ marginTop: '4px', textAlign: 'left' }}>
        <Typography variant="bodyXSmall" color="textSecondary" component="span">
          {tokenUSDAmount
            ? Intl.NumberFormat('en-US', {
                style: 'currency',
                notation: 'compact',
                currency: 'USD',
                useGrouping: true,
                minimumFractionDigits: 0,
                maximumFractionDigits: parseFloat(tokenUSDAmount) > 2 ? 2 : 4,
              }).format(parseFloat(tokenUSDAmount))
            : 'NA'}
        </Typography>
      </Box>
    </Box>
  );
}

export default WidgetFieldStartAdornment;
