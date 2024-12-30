import { Box, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';

interface DigitCardProps {
  title: string;
  digit: string | number;
  tooltipText?: string;
}

const DigitCard = ({ title, digit, tooltipText }: DigitCardProps) => {
  return (
    <Box>
      <BeraChainProgressCardContent>
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
            typography: {
              xs: theme.typography.titleXSmall,
              sm: theme.typography.titleXSmall,
            },
          })}
        >
          {digit}
        </Typography>
      </BeraChainProgressCardContent>
    </Box>
  );
};

export default DigitCard;
