import InfoIcon from '@mui/icons-material/Info';
import type { SxProps, Theme } from '@mui/material';
import { Tooltip, Typography } from '@mui/material';
import type { CSSProperties } from 'react';
import {
  BeraChainProgressCardComponent,
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from './BerachainProgressCard.style';
import { useTranslation } from 'react-i18next';

interface BerachainProgressCardProps {
  title: string;
  value?: string;
  tooltip?: string | React.ReactNode;
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
        <Typography
          variant="titleSmall"
          marginTop={'4px'}
          sx={(theme) => ({
            typography: {
              xs: theme.typography.titleXSmall,
              sm: theme.typography.titleSmall,
            },
            ...(valueSx as CSSProperties),
          })}
        >
          {value || 'N/A'}
        </Typography>
      </BeraChainProgressCardContent>
    </BeraChainProgressCardComponent>
  );
};
