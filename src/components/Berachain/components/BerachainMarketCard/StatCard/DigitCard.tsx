import { Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';

interface DigitCardProps {
  title: string;
  digit: string | number | React.ReactNode;
  tooltipText?: string;
  endAdornment?: React.ReactNode;
  sx?: React.CSSProperties;
}

const DigitCard = ({
  title,
  digit,
  tooltipText,
  endAdornment,
  sx = {},
}: DigitCardProps) => {
  return (
    <BeraChainProgressCardContent sx={sx}>
      <BeraChainProgressCardHeader display={'flex'}>
        <Typography
          variant="bodySmall"
          sx={(theme) => ({
            typography: {
              xs: theme.typography.bodyXSmall,
              sm: theme.typography.bodySmall,
            },
          })}
        >
          {title}
        </Typography>
        <Tooltip
          title={tooltipText}
          placement={'top'}
          enterTouchDelay={0}
          arrow
        >
          <InfoIcon
            sx={{
              width: '16px',
              height: '16px',
              marginLeft: '4px',
              color: 'inherit',
            }}
          />
        </Tooltip>
      </BeraChainProgressCardHeader>
      <Typography
        variant="titleXSmall"
        marginTop={'4px'}
        sx={(theme) => ({
          display: 'inline-flex',
          typography: {
            xs: theme.typography.titleXSmall,
            sm: theme.typography.titleXSmall,
          },
        })}
      >
        {digit}
        {endAdornment}
      </Typography>
    </BeraChainProgressCardContent>
  );
};

export default DigitCard;
