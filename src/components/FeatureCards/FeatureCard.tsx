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
    if (data?.DisplayConditions?.showOnce) {
      setDisabledFeatureCard(data?.uid);
    }
  }, [
    data?.DisplayConditions,
    data?.uid,
    setDisabledFeatureCard,
  ]);

  const mode = data?.DisplayConditions.mode;

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
          [TrackingEventParameter.FeatureCardTitle]: data?.Title,
          [TrackingEventParameter.FeatureCardId]: data?.uid,
          url: data?.URL,
        },
      });
      eventFired.current = true;
    }
  }, [data?.uid, data?.Title, data?.URL, open, trackEvent]);

  const imageUrl = useMemo(() => {
    const imageMode = mode || theme.palette.mode;
    if (
      !data?.BackgroundImageDark?.data?.url ||
      !data?.BackgroundImageLight?.data?.url
    ) {
      return null;
    }
    return imageMode === 'dark'
      ? new URL(
          data?.BackgroundImageDark?.data?.url,
          process.env.NEXT_PUBLIC_STRAPI_URL,
        )
      : new URL(
          data?.BackgroundImageLight?.data?.url,
          process.env.NEXT_PUBLIC_STRAPI_URL,
        );
  }, [
    data?.BackgroundImageDark?.data?.url,
    data?.BackgroundImageLight?.data?.url,
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
      !data?.DisplayConditions.showOnce &&
      !!data?.uid
    ) {
      setDisabledFeatureCard(data?.uid);
    }
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

  const handleClick = (
    event: React.MouseEvent<
      HTMLDivElement | HTMLAnchorElement | HTMLButtonElement,
      MouseEvent
    >,
    label: string,
  ) => {
    event.stopPropagation();
    if (data?.URL) {
      openInNewTab(data?.URL);
    }

    // Mark feature card as disabled if needed
    if (
      !('showOnce' in data?.DisplayConditions) &&
      !!data.attributes?.uid
    ) {
      setDisabledFeatureCard(data?.uid);
    }

    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.ClickFeatureCard,
      label: label,
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data?.Title,
        [TrackingEventParameter.FeatureCardId]: data?.uid,
        url: data?.URL,
      },
    });

    handleSpindl(data);
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
              typographyColor={
                data.attributes?.SubtitleColor || typographyColor
              }
            >
              {data?.Subtitle}
            </FeatureCardSubtitle>
          )}
          <FeatureCardActions>
            <FeatureCardCtaLink
              target="_blank"
              rel="noopener"
              href={data?.URL}
              onClick={(e) => handleClick(e, 'click_cta')}
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
