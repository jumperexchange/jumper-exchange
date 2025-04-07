import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, IconButton, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import { ButtonSecondary } from 'src/components/Button';
import { getContrastAlphaColor } from 'src/utils/colors';
import { ModalMenuContent, ModalMenuHeader } from './ModalMenuPage.style';

export const ModalMenuPage = ({
  title,
  buttonLabel,
  setOpen,
  content,
  text,
  onClick,
  index,
  showPrevButton,
  menuIndex,
  setMenuIndex,
  hideClose = false,
}: {
  title?: string;
  buttonLabel: string;
  text?: string;
  setOpen?: (value: boolean) => void;
  content: JSX.Element;
  onClick: (event: React.MouseEvent) => void;
  index: number;
  showPrevButton?: boolean;
  menuIndex: number;
  setMenuIndex: Dispatch<SetStateAction<number>>;
  hideClose?: boolean;
}) => {
  return (
    index === menuIndex && (
      <>
        <ModalMenuHeader>
          {showPrevButton ? (
            <IconButton
              size="medium"
              aria-label="settings"
              edge="start"
              sx={(theme) => ({
                marginLeft: 0,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: getContrastAlphaColor(theme, '4%'),
                },
              })}
              onClick={(event) => {
                event.stopPropagation();
                setMenuIndex((state) => state - 1);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <span style={{ width: '40px' }} />
          )}
          <Typography variant="titleXSmall">{title}</Typography>
          {!hideClose ? (
            <IconButton
              aria-label="close"
              onClick={() => setOpen?.(false)}
              sx={(theme) => ({
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.04),
                },
              })}
            >
              <CloseIcon />
            </IconButton>
          ) : (
            <span style={{ width: '40px' }} />
          )}
        </ModalMenuHeader>
        <ModalMenuContent>{content}</ModalMenuContent>
        {text && <Typography variant="bodyMedium">{text}</Typography>}
        <ButtonSecondary sx={{ color: '#200052' }} onClick={onClick}>
          <Typography
            variant="bodyMediumStrong"
            component="span"
            sx={(theme) => ({ color: theme.palette.text.primary })}
          >
            {buttonLabel}
          </Typography>
        </ButtonSecondary>
      </>
    )
  );
};
