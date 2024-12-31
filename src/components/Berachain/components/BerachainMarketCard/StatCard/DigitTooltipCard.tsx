import {
  alpha,
  Box,
  Breakpoint,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { BerachainProgressCard } from './BerachainProgressCard';

interface DigitCardProps {
  title: string;
  digit: string;
  tooltipText?: string;
}

const DigitTooltipCard = ({ title, digit, tooltipText }: DigitCardProps) => {
  const theme = useTheme();

  return (
    <Tooltip title={tooltipText} placement="top" enterTouchDelay={0} arrow>
      <div style={{ flexGrow: 1 }}>
        <BerachainProgressCard
          title={title}
          value={digit}
          showTooltipIcon={true}
          sx={{
            height: '100%',
            padding: theme.spacing(1.5, 2),
            display: 'flex',
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 2),
            },
          }}
          valueSx={{
            color: alpha(theme.palette.white.main, 0.84),
            fontSize: theme.typography.titleXSmall.fontSize,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              fontSize: theme.typography.titleXSmall.fontSize,
            },
          }}
        />
      </div>
    </Tooltip>
  );
};

export default DigitTooltipCard;
