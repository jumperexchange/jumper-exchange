import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, IconButton, Typography } from '@mui/material';
import type { Dispatch, ReactElement, SetStateAction } from 'react';
import { ButtonSecondary } from 'src/components/Button';
import { getContrastAlphaColor } from 'src/utils/colors';
import {
  WalletLinkingContent,
  WalletLinkingHeader,
} from './WalletLinkingMenu.style';

export const WalletLinkingMenu = ({
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
}: {
  title?: string;
  buttonLabel: string;
  text?: string;
  setOpen: any;
  content: ReactElement;
  onClick: () => void;
  index: number;
  showPrevButton?: boolean;
  menuIndex: number;
  setMenuIndex: Dispatch<SetStateAction<number>>;
}) => {
  return (
    index === menuIndex && (
      <>
        <WalletLinkingHeader>
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
            <span />
          )}
          <Typography variant="titleXSmall">{title}</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={(theme) => ({
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, 0.04),
              },
            })}
            color="primary"
          >
            <CloseIcon />
          </IconButton>
        </WalletLinkingHeader>
        <WalletLinkingContent>{content}</WalletLinkingContent>
        {text && <Typography variant="bodyMedium">{text}</Typography>}
        <ButtonSecondary sx={{ color: '#200052' }} onClick={onClick}>
          <Typography variant="bodyMediumStrong" component="span">
            {buttonLabel}
          </Typography>
        </ButtonSecondary>
      </>
    )
  );
};
