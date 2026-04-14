import BackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { FC, PropsWithChildren } from 'react';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import {
  StyledDrawerContent,
  StyledDrawerHeader,
} from './FullScreenDrawer.styles';

interface FullScreenDrawerProps extends PropsWithChildren {
  id?: string;
  isOpen: boolean;
  externalOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  title: string;
  contentSx?: SxProps<Theme>;
  headerSx?: SxProps<Theme>;
}

export const FullScreenDrawer: FC<FullScreenDrawerProps> = ({
  id,
  isOpen,
  children,
  onClose,
  onBack,
  showBackButton,
  title,
  contentSx,
  headerSx,
}) => {
  return (
    <Drawer
      id={id}
      anchor={showBackButton ? 'right' : 'bottom'}
      open={isOpen}
      onClose={onClose}
      hideBackdrop
      slotProps={{
        paper: {
          sx: (theme) => ({
            width: '100dvw',
            maxWidth: '100dvw',
            height: '100dvh',
            maxHeight: '100dvh',
            overflow: 'auto',
            background: (theme.vars || theme).palette.surface1.main,
            border: getSurfaceBorder(theme, 'surface1'),
          }),
        },
      }}
      sx={(theme) => ({ zIndex: theme.zIndex.modal + 1 })}
    >
      <StyledDrawerContent sx={contentSx}>
        <StyledDrawerHeader sx={headerSx}>
          {showBackButton && (
            <IconButton
              onClick={onBack}
              sx={{ position: 'absolute', left: 0, top: 0 }}
            >
              <BackIcon />
            </IconButton>
          )}

          <IconButton
            onClick={onClose}
            data-testId="drawer-close-button"
            sx={{ position: 'absolute', right: 0, top: 0 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="titleXSmall"
            sx={{
              display: 'block',
              textAlign: 'center',
              lineHeight: '40px',
            }}
          >
            {title}
          </Typography>
        </StyledDrawerHeader>
        {children}
      </StyledDrawerContent>
    </Drawer>
  );
};
