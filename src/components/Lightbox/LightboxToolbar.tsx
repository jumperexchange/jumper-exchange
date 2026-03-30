import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import Box from '@mui/material/Box';
import type { FC } from 'react';
import { LightboxToolbarContainer } from './Lightbox.style';
import { MAX_SCALE, MIN_SCALE } from './useLightbox';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { formatValueWithConfig } from '@/utils/formatNumbers';

interface LightboxToolbarProps {
  scale: number;
  isFullscreen: boolean;
  supportsFullscreen: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export const LightboxToolbar: FC<LightboxToolbarProps> = ({
  scale,
  isFullscreen,
  supportsFullscreen,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <LightboxToolbarContainer onClick={(e) => e.stopPropagation()}>
      <Tooltip title={t('tooltips.zoomOut')}>
        <Box component="span">
          <IconButton
            onClick={onZoomOut}
            disabled={scale <= MIN_SCALE}
            size={Size.LG}
            variant={Variant.Borderless}
          >
            <ZoomOutIcon />
          </IconButton>
        </Box>
      </Tooltip>

      <Typography variant="bodyMedium" component="span">
        {formatValueWithConfig(scale, { type: 'percentage' })}
      </Typography>

      <Tooltip title={t('tooltips.zoomIn')}>
        <Box component="span">
          <IconButton
            onClick={onZoomIn}
            disabled={scale >= MAX_SCALE}
            size={Size.LG}
            variant={Variant.Borderless}
          >
            <ZoomInIcon />
          </IconButton>
        </Box>
      </Tooltip>

      {supportsFullscreen && (
        <Tooltip
          title={t(
            `tooltips.${isFullscreen ? 'exitFullscreen' : 'fullscreen'}`,
          )}
        >
          <IconButton
            onClick={onToggleFullscreen}
            size={Size.LG}
            variant={Variant.Borderless}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title={t('tooltips.close')}>
        <IconButton
          onClick={onClose}
          size={Size.LG}
          variant={Variant.Borderless}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </LightboxToolbarContainer>
  );
};
