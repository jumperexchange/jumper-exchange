'use client';
import Slide from '@mui/material/Slide';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FeatureCardData } from '@/types/strapi';
import { openInNewTab } from 'src/utils/openInNewTab';
import CloseIcon from '@mui/icons-material/Close';
import {
  FCard as Card,
  FeatureCardActions,
  FeatureCardCloseButton,
  FeatureCardContent,
  FeatureCardCtaLabel,
  FeatureCardCtaLink,
  FeatureCardSubtitle,
  FeatureCardTitle,
} from './FeatureCard.style';
import {
  useFeatureCardTracking,
  useFeatureCardColors,
  useFeatureCardImage,
  useFeatureCardDisable,
  useFeatureCardStyles,
} from './hooks';
import { useAccount } from '@lifi/wallet-management';
import { useAdCooldownStore } from '@/stores/adCooldown/AdCooldownStore';

interface FeatureCardProps {
  data: FeatureCardData;
}

export const FeatureCard = ({ data }: FeatureCardProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { account } = useAccount();

  const imageUrl = useFeatureCardImage(data);
  const colors = useFeatureCardColors(data, imageUrl);
  const cardStyles = useFeatureCardStyles();
  const { trackDisplay, trackClose, trackClick } = useFeatureCardTracking(data);
  const { disableCard } = useFeatureCardDisable(data);

  const walletAddress = account?.address ?? '';
  const isInCooldown = useAdCooldownStore((state) =>
    state.isInCooldown(walletAddress),
  );
  const getActiveAdId = useAdCooldownStore((state) => state.getActiveAdId);
  const setAdShown = useAdCooldownStore((state) => state.setAdShown);
  const _hasHydrated = useAdCooldownStore((state) => state._hasHydrated);

  const adId = (data.uid ?? data.id)?.toString() ?? '';
  const isActiveAd = getActiveAdId(walletAddress) === adId;

  useEffect(() => {
    if (!_hasHydrated || !adId || isInCooldown || isActiveAd) {
      return;
    }
    setAdShown(walletAddress, adId);
  }, [_hasHydrated, walletAddress, adId, isActiveAd, isInCooldown, setAdShown]);

  useEffect(() => {
    if (!isActiveAd) {
      return;
    }
    setOpen(true);
  }, [isActiveAd]);

  if ((isInCooldown && !isActiveAd) || !open || !_hasHydrated) {
    return null;
  }

  const handleImpressionOnce = () => {
    if (open) {
      trackDisplay();
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(false);
    disableCard({ isShowOnce: false });
    trackClose();
  };

  const handleClick = (
    event: React.MouseEvent<
      HTMLDivElement | HTMLAnchorElement | HTMLButtonElement
    >,
    label: string,
  ) => {
    event.stopPropagation();

    if (data?.URL) {
      openInNewTab(data.URL);
    }

    disableCard({ isShowOnce: false });
    trackClick(label);
  };

  const handleOpenChange = () => {
    if (open) {
      handleImpressionOnce();
    }
  };

  return (
    <Slide
      direction="up"
      in={open}
      unmountOnExit
      appear
      timeout={500}
      easing="cubic-bezier(0.32, 0, 0.67, 0)"
      onEnter={handleOpenChange}
    >
      <Card
        backgroundImageUrl={imageUrl?.href}
        onClick={(e) => handleClick(e, 'click_card')}
        isDarkCard={data?.DisplayConditions?.mode === 'dark'}
        sx={cardStyles}
      >
        <FeatureCardContent>
          <FeatureCardCloseButton
            disableRipple
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon
              sx={{
                width: 24,
                height: 24,
                color: colors.icon,
              }}
            />
          </FeatureCardCloseButton>

          {data?.Title && (
            <FeatureCardTitle
              variant="headerSmall"
              color={colors.title}
              gutterBottom
            >
              {data.Title}
            </FeatureCardTitle>
          )}

          {data?.Subtitle && (
            <FeatureCardSubtitle variant="bodySmall" color={colors.subtitle}>
              {data.Subtitle}
            </FeatureCardSubtitle>
          )}

          <FeatureCardActions>
            <FeatureCardCtaLink
              target="_blank"
              rel="noopener"
              href={data?.URL}
              onClick={(e) => handleClick(e, 'click_cta')}
            >
              <FeatureCardCtaLabel variant="bodySmallStrong" color={colors.cta}>
                {data?.CTACall ?? t('featureCard.learnMore')}
              </FeatureCardCtaLabel>
            </FeatureCardCtaLink>
          </FeatureCardActions>
        </FeatureCardContent>
      </Card>
    </Slide>
  );
};
