'use client';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useSettingsStore } from '@/stores/settings';
import type { FeatureCardAttributes, FeatureCardData } from '@/types/strapi';
import CloseIcon from '@mui/icons-material/Close';
import { Slide, useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackSpindl } from 'src/hooks/feature-cards/spindl/trackSpindl';
import { isSpindlTrackData, type SpindlCardAttributes } from 'src/types/spindl';
import { openInNewTab } from 'src/utils/openInNewTab';
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
}

export const FeatureCard = ({ data }: FeatureCardProps) => {
  const [open, setOpen] = useState(true);
  const eventFired = useRef(false);

  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [setDisabledFeatureCard] = useSettingsStore((state) => [
    state.setDisabledFeatureCard,
  ]);
  const theme = useTheme();
  useEffect(() => {
    if (data.attributes?.DisplayConditions?.showOnce) {
      setDisabledFeatureCard(data.attributes?.uid);
    }
  }, [
    data.attributes?.DisplayConditions,
    data.attributes?.uid,
    setDisabledFeatureCard,
  ]);

  const mode = data.attributes?.DisplayConditions.mode;

  const typographyColor = useMemo(() => {
    if (mode) {
      if (mode === 'dark') {
        return theme.palette.white.main;
      } else if (mode === 'light') {
        return theme.palette.black.main;
      }
    } else {
      return theme.palette.text.primary;
    }
  }, [
    mode,
    theme.palette.black.main,
    theme.palette.text.primary,
    theme.palette.white.main,
  ]);

  useEffect(() => {
    if (isSpindlTrackData(data.attributes)) {
      trackSpindl(
        'impression',
        data.attributes.spindlData.impression_id,
        data.attributes.spindlData.ad_creative_id,
      );
    }
    // allow spindl data to be tracked once
  }, [data.attributes]);

  useEffect(() => {
    if (!eventFired.current && open) {
      trackEvent({
        category: TrackingCategory.FeatureCard,
        action: TrackingAction.DisplayFeatureCard,
        label: 'display-feature-card',
        data: {
          [TrackingEventParameter.FeatureCardTitle]: data.attributes?.Title,
          [TrackingEventParameter.FeatureCardId]: data.attributes?.uid,
          url: data.attributes?.URL,
        },
      });
      eventFired.current = true;
    }
  }, [
    data.attributes?.uid,
    data.attributes?.Title,
    data.attributes?.URL,
    open,
    trackEvent,
  ]);

  const imageUrl = useMemo(() => {
    const imageMode = mode || theme.palette.mode;
    if (
      !data.attributes?.BackgroundImageDark?.data?.attributes?.url ||
      !data.attributes?.BackgroundImageLight?.data?.attributes?.url
    ) {
      return null;
    }
    return imageMode === 'dark'
      ? new URL(
          data.attributes?.BackgroundImageDark?.data?.attributes?.url,
          process.env.NEXT_PUBLIC_STRAPI_URL,
        )
      : new URL(
          data.attributes?.BackgroundImageLight?.data?.attributes?.url,
          process.env.NEXT_PUBLIC_STRAPI_URL,
        );
  }, [
    data.attributes?.BackgroundImageDark?.data?.attributes?.url,
    data.attributes?.BackgroundImageLight?.data?.attributes?.url,
    mode,
    theme.palette.mode,
  ]);

  const handleSpindl = (
    attributes: SpindlCardAttributes | FeatureCardAttributes,
  ) => {
    if (!isSpindlTrackData(attributes)) {
      return;
    }
    trackSpindl(
      'click',
      attributes.spindlData.impression_id,
      attributes.spindlData.ad_creative_id,
    );
  };

  const handleClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setOpen(false);
    if (
      !data.attributes?.DisplayConditions.showOnce &&
      !!data.attributes?.uid
    ) {
      setDisabledFeatureCard(data.attributes?.uid);
    }
    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.CloseFeatureCard,
      label: `click_close`,
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data.attributes?.Title,
        [TrackingEventParameter.FeatureCardId]: data.attributes?.uid,
      },
    });
  };

  const handleClick = (
    event: React.MouseEvent<
      HTMLDivElement | HTMLAnchorElement | HTMLButtonElement,
      MouseEvent
    >,
    label: string,
  ) => {
    event.stopPropagation();
    if (data?.attributes?.URL) {
      openInNewTab(data?.attributes?.URL);
    }

    // Mark feature card as disabled if needed
    if (
      !('showOnce' in data.attributes?.DisplayConditions) &&
      !!data.attributes?.uid
    ) {
      setDisabledFeatureCard(data.attributes?.uid);
    }

    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.ClickFeatureCard,
      label: label,
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data.attributes?.Title,
        [TrackingEventParameter.FeatureCardId]: data.attributes?.uid,
        url: data.attributes?.URL,
      },
    });

    handleSpindl(data.attributes);
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
        onClick={(e) => handleClick(e, 'click_card')}
        isDarkCard={mode === 'dark'}
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
          {!!data.attributes?.Title && (
            <FeatureCardTitle
              variant="headerSmall"
              data={data}
              typographyColor={data.attributes?.TitleColor || typographyColor}
              gutterBottom
            >
              {data.attributes?.Title}
            </FeatureCardTitle>
          )}
          {!!data.attributes?.Subtitle && (
            <FeatureCardSubtitle
              variant="bodySmall"
              typographyColor={
                data.attributes?.SubtitleColor || typographyColor
              }
            >
              {data.attributes?.Subtitle}
            </FeatureCardSubtitle>
          )}
          <FeatureCardActions>
            <FeatureCardCtaLink
              target="_blank"
              rel="noopener"
              href={data.attributes?.URL}
              onClick={(e) => handleClick(e, 'click_cta')}
              data={data}
            >
              <FeatureCardCtaLabel
                variant="bodySmallStrong"
                data={data}
                typographyColor={data.attributes?.CTAColor || typographyColor}
              >
                {data.attributes?.CTACall ?? t('featureCard.learnMore')}
              </FeatureCardCtaLabel>
            </FeatureCardCtaLink>
          </FeatureCardActions>
        </FeatureCardContent>
      </Card>
    </Slide>
  );
};
