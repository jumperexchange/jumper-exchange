'use client';
import CloseIcon from '@mui/icons-material/Close';
import XIcon from '@mui/icons-material/X';
import { Avatar, Box, IconButton, Typography, styled } from '@mui/material';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { WIDGET_WIDTH } from 'src/config/widgetConfig';
import { X_SHARE_URL } from '@/const/urls';
import { useSocialCardStore } from '@/stores/socialCard/SocialCardStore';
import {
  buildPnlShareLandingUrl,
  formatUsdCompact,
} from '@/utils/image-generation/pnlShareCard';
import { openInNewTab } from '@/utils/openInNewTab';

const Pill = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  maxWidth: WIDGET_WIDTH,
  margin: theme.spacing(1.5, 'auto', 0),
  padding: '1.5px',
  borderRadius: theme.spacing(4),
  cursor: 'pointer',
  boxShadow: theme.shadows[3],
  // Purple gradient border sliding across the card once every 4s. First and
  // last colour stops match so the loop is seamless.
  background:
    'linear-gradient(90deg, #7A3EF0, #B58AFF, #5C1EEB, #B58AFF, #7A3EF0)',
  backgroundSize: '200% 100%',
  animation: 'socialCardBorderFlow 4s linear infinite',
  transitionProperty: 'transform',
  transitionDuration: '0.15s',
  transitionTimingFunction: 'ease',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
  '@keyframes socialCardBorderFlow': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '100%': {
      backgroundPosition: '200% 50%',
    },
  },
}));

const PillInner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5, 1, 1),
  borderRadius: theme.spacing(4),
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
}));

export const SocialCardNudge = () => {
  const { t } = useTranslation();
  const card = useSocialCardStore((state) => state.card);
  const dismiss = useSocialCardStore((state) => state.dismiss);

  if (!card) {
    return null;
  }

  const amount = `$${formatUsdCompact(card.amountWon)}`;
  const origin =
    typeof window !== 'undefined' ? window.location.origin : undefined;
  const shareLink = buildPnlShareLandingUrl(card, origin);
  const shareText = t('socialCard.shareText', {
    amountWon: amount,
    fromToken: card.fromToken,
    toToken: card.toToken,
    defaultValue: `I just got ${amount} extra output on my ${card.fromToken} → ${card.toToken} swap with Jumper 🚀`,
  });

  const handleShare = () => {
    const url = new URL(X_SHARE_URL);
    url.searchParams.set('text', shareText);
    url.searchParams.set('url', shareLink);
    openInNewTab(url.href);
  };

  const handleDismiss = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dismiss();
  };

  return (
    <Pill
      className="alert"
      role="button"
      tabIndex={0}
      onClick={handleShare}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleShare();
        }
      }}
    >
      <PillInner>
        <Avatar
          sx={{
            width: 24,
            height: 24,
            bgcolor: 'text.primary',
            color: 'background.paper',
          }}
        >
          <XIcon sx={{ fontSize: 12 }} />
        </Avatar>
        <Typography variant="bodyXSmall">
          {t('socialCard.nudgeCta', {
            amount,
            defaultValue: `You won ${amount} vs. the median amount quote. Share on X`,
          })}
        </Typography>
        <IconButton
          aria-label={t('button.close', { defaultValue: 'Dismiss' })}
          onClick={handleDismiss}
          size="small"
        >
          <CloseIcon sx={{ height: 16, width: 16 }} />
        </IconButton>
      </PillInner>
    </Pill>
  );
};
