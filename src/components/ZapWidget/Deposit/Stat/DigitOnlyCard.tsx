import type { SxProps, Theme } from '@mui/material';
import { Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from 'src/components/Berachain/components/BerachainMarketCard/StatCard/BerachainProgressCard.style';

interface DigitCardProps {
  title: string;
  digit: string | number | React.ReactNode;
  tooltipText?: string | React.ReactNode;
  endAdornment?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const DigitOnlyCard = ({
  title,
  digit,
  tooltipText,
  endAdornment,
  sx = {},
}: DigitCardProps) => {
  return (
    <BeraChainProgressCardContent sx={sx}>
      <BeraChainProgressCardHeader
        display={'flex'}
        className="header-container"
      >
        <Typography className="title" variant="subtitle2">
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
              cursor: 'help',
            }}
          />
        </Tooltip>
      </BeraChainProgressCardHeader>
      <Typography
        className="content"
        variant="h6"
        marginTop={'4px'}
        fontWeight={700}
      >
        {digit}
        {endAdornment}
      </Typography>
    </BeraChainProgressCardContent>
  );
};

export default DigitOnlyCard;
