'use client';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useSettingsStore } from '@/stores/settings';
import type { FeatureCardData } from '@/types/strapi';
import { openInNewTab } from '@/utils/openInNewTab';
import CloseIcon from '@mui/icons-material/Close';
import { Slide, useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FCard as Card,
  FeatureCardActions,
  FeatureCardCloseButton,
  FeatureCardContent,
  FeatureCardCtaLabel,
  FeatureCardCtaLink,
  FeatureCardSubtitle,
  FeatureCardTitle,
} from '.';

interface FeatureCardProps {
  data: FeatureCardData;
  isSuccess: boolean;
}

export const FeatureCard = ({ data, isSuccess }: FeatureCardProps) => {
  const [open, setOpen] = useState(true);
  const eventFired = useRef(false);

  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [setDisabledFeatureCard] = useSettingsStore((state) => [
    state.setDisabledFeatureCard,
  ]);
  const theme = useTheme();
  useEffect(() => {
    if (data?.DisplayConditions?.showOnce) {
      setDisabledFeatureCard(data?.uid);
    }
  }, [data?.DisplayConditions, data?.uid, setDisabledFeatureCard]);

  const typographyColor = useMemo(() => {
    if (data?.DisplayConditions.mode) {
      if (data?.DisplayConditions.mode === 'dark') {
        return theme.palette.white.main;
      } else if (data?.DisplayConditions.mode === 'light') {
        return theme.palette.black.main;
      }
    } else {
      return theme.palette.text.primary;
    }
  }, [
    data?.DisplayConditions.mode,
    theme.palette.black.main,
    theme.palette.text.primary,
    theme.palette.white.main,
  ]);

  useEffect(() => {
    if (!eventFired.current && open) {
      trackEvent({
        category: TrackingCategory.FeatureCard,
        action: TrackingAction.DisplayFeatureCard,
        label: 'display-feature-card',
        data: {
          [TrackingEventParameter.FeatureCardTitle]: data?.Title,
          [TrackingEventParameter.FeatureCardId]: data?.uid,
          url: data?.URL,
        },
      });
      eventFired.current = true;
    }
  }, [data?.uid, data?.Title, data?.URL, open, trackEvent]);

  const mode = data?.DisplayConditions.mode || theme.palette.mode;

  const imageUrl =
    mode === 'dark'
      ? new URL(
          data?.BackgroundImageDark?.url,
          process.env.NEXT_PUBLIC_STRAPI_URL,
        )
      : new URL(
          data?.BackgroundImageLight?.url,
          process.env.NEXT_PUBLIC_STRAPI_URL,
        );

  const handleClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setOpen(false);
    !data?.DisplayConditions?.hasOwnProperty('showOnce') &&
      !!data?.uid &&
      setDisabledFeatureCard(data?.uid);
    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.CloseFeatureCard,
      label: `click_close`,
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data?.Title,
        [TrackingEventParameter.FeatureCardId]: data?.uid,
      },
    });
  };

  const handleCTA = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    !data?.DisplayConditions?.hasOwnProperty('showOnce') &&
      !!data?.uid &&
      setDisabledFeatureCard(data?.uid);
    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.ClickFeatureCard,
      label: `click_cta`,
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data?.Title,
        [TrackingEventParameter.FeatureCardId]: data?.uid,
        url: data?.URL,
      },
    });
  };

  const handleCardClick = () => {
    data?.URL && openInNewTab(data?.URL);
    !data?.DisplayConditions?.hasOwnProperty('showOnce') &&
      !!data?.uid &&
      setDisabledFeatureCard(data?.uid);
    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.ClickFeatureCard,
      label: 'click_card_bg',
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data?.Title,
        [TrackingEventParameter.FeatureCardId]: data?.uid,
        url: data?.URL,
      },
    });
  };

  return (
    <Slide
      direction="up"
      in={open}
      unmountOnExit
      appear={true}
      timeout={500}
      easing={'cubic-bezier(0.32, 0, 0.67, 0)'}
    >
      <Card
        backgroundImageUrl={imageUrl?.href}
        onClick={handleCardClick}
        isDarkCard={data?.DisplayConditions.mode === 'dark'}
      >
        <FeatureCardContent>
          <FeatureCardCloseButton
            disableRipple={true}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 1,
              top: 1,
            }}
            onClick={(e) => handleClose(e)}
          >
            <CloseIcon
              sx={{
                width: 24,
                height: 24,
                color: typographyColor,
              }}
            />
          </FeatureCardCloseButton>
          {!!data?.Title && (
            <FeatureCardTitle
              variant="headerSmall"
              data={data}
              typographyColor={data?.TitleColor || typographyColor}
              gutterBottom
            >
              {data?.Title}
            </FeatureCardTitle>
          )}
          {!!data?.Subtitle && (
            <FeatureCardSubtitle
              variant="bodySmall"
              typographyColor={typographyColor}
            >
              {data?.Subtitle}
            </FeatureCardSubtitle>
          )}
          <FeatureCardActions>
            <FeatureCardCtaLink
              target="_blank"
              rel="noopener"
              href={data?.URL}
              onClick={(e) => handleCTA(e)}
              data={data}
            >
              <FeatureCardCtaLabel
                variant="bodySmallStrong"
                data={data}
                typographyColor={data?.CTAColor || typographyColor}
              >
                {data?.CTACall ?? t('featureCard.learnMore')}
              </FeatureCardCtaLabel>
            </FeatureCardCtaLink>
          </FeatureCardActions>
        </FeatureCardContent>
      </Card>
    </Slide>
  );
};
