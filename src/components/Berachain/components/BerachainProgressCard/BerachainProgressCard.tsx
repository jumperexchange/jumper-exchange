import InfoIcon from '@mui/icons-material/Info';
import type { SxProps, Theme } from '@mui/material';
import { Tooltip, Typography } from '@mui/material';
import {
  BeraChainProgressCardComponent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';

interface BerachainProgressCardProps {
  title: string;
  value?: string;
  tooltip?: string;
  sx?: SxProps<Theme> | undefined;
  valueSx?: SxProps<Theme> | undefined;
}

export const BerachainProgressCard = ({
  title,
  value,
  tooltip,
  valueSx,
  sx,
}: BerachainProgressCardProps) => {
  return (
    <BeraChainProgressCardComponent sx={sx}>
      <BeraChainProgressCardHeader display={'flex'}>
        <Typography variant="bodySmall">{title}</Typography>
        {tooltip && (
          <Tooltip title={tooltip} placement={'top'} enterTouchDelay={0} arrow>
            <InfoIcon
              sx={{
                width: '16px',
                height: '16px',
                marginLeft: '4px',
                color: 'inherit',
              }}
            />
          </Tooltip>
        )}
      </BeraChainProgressCardHeader>
      <Typography variant="bodyLargeStrong" marginTop={'4px'} sx={valueSx}>
        {value || 'N/A'}
      </Typography>
    </BeraChainProgressCardComponent>
  );
};
