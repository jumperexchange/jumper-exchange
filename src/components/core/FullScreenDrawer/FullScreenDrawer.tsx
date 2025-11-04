import Drawer from '@mui/material/Drawer';
import { FC, PropsWithChildren } from 'react';
import {
  StyledDrawerContent,
  StyledDrawerHeader,
} from './FullScreenDrawer.styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import BackIcon from '@mui/icons-material/ArrowBack';

interface FullScreenDrawerProps extends PropsWithChildren {
  isOpen: boolean;
  externalOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  title: string;
}

export const FullScreenDrawer: FC<FullScreenDrawerProps> = ({
  isOpen,
  children,
  onClose,
  onBack,
  showBackButton,
  title,
}) => {
  return (
    <Drawer
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
          }),
        },
      }}
      sx={(theme) => ({ zIndex: theme.zIndex.modal + 1 })}
    >
      <StyledDrawerContent>
        <StyledDrawerHeader>
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
