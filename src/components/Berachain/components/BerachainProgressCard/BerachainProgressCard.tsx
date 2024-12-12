import InfoIcon from '@mui/icons-material/Info';
import type { SxProps, Theme } from '@mui/material';
import { Typography } from '@mui/material';
import { Tooltip } from '@mui/material';
import {
  BeraChainProgressCardComponent,
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';
import { useTranslation } from 'react-i18next';

interface BerachainProgressCardProps {
  title: string;
  value?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
  valueSx?: SxProps<Theme> | undefined;
}

export const BerachainProgressCard = ({
  title,
  value,
  tooltip,
  valueSx,
  icon,
  sx,
}: BerachainProgressCardProps) => {
  const { t } = useTranslation();

  return (
    <BeraChainProgressCardComponent sx={sx}>
      {icon && icon}
      <BeraChainProgressCardContent>
        <BeraChainProgressCardHeader display={'flex'}>
          <Typography variant="bodySmall">{title}</Typography>
          {tooltip && (
            <Tooltip
              title={tooltip}
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
          )}
        </BeraChainProgressCardHeader>
        <Typography variant="bodyLargeStrong" marginTop={'4px'} sx={valueSx}>
          {value}
        </Typography>
      </BeraChainProgressCardContent>
    </BeraChainProgressCardComponent>
  );
};
