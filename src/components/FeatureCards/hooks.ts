import { useEffect, useMemo, useRef } from 'react';
import type { FeatureCardData } from '@/types/strapi';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { isSpindlTrackData } from '@/types/spindl';
import { trackSpindl } from '@/hooks/feature-cards/spindl/trackSpindl';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useGetContrastTextColor } from '@/hooks/images/useGetContrastTextColor';
import {
  type Theme,
  type SxProps,
  useColorScheme,
  useTheme,
} from '@mui/material/styles';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { useThemeConditionsMet } from '@/hooks/theme/useThemeConditionsMet';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';

export const useFeatureCardTracking = (data: FeatureCardData) => {
  const { trackEvent } = useUserTracking();
  const impressionEventFired = useRef(false);
  const displayEventFired = useRef(false);

  // Track Spindl impression on mount
  useEffect(() => {
    if (impressionEventFired.current) {
      return;
    }
    impressionEventFired.current = true;

    if (isSpindlTrackData(data)) {
      trackSpindl(
        'impression',
        data.spindlData.impression_id,
        data.spindlData.ad_creative_id,
      );
    }
  }, [data]);

  const trackDisplay = () => {
    if (displayEventFired.current) {
      return;
    }
    displayEventFired.current = true;

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
  };

  const trackClose = () => {
    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.CloseFeatureCard,
      label: 'click_close',
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data?.Title,
        [TrackingEventParameter.FeatureCardId]: data?.uid,
      },
    });
  };

  const trackClick = (label: string) => {
    trackEvent({
      category: TrackingCategory.FeatureCard,
      action: TrackingAction.ClickFeatureCard,
      label,
      data: {
        [TrackingEventParameter.FeatureCardTitle]: data?.Title,
        [TrackingEventParameter.FeatureCardId]: data?.uid,
        url: data?.URL,
      },
    });

    // Track Spindl click
    if (isSpindlTrackData(data)) {
      trackSpindl(
        'click',
        data.spindlData.impression_id,
        data.spindlData.ad_creative_id,
      );
    }
  };

  return { trackDisplay, trackClose, trackClick };
};

export const useFeatureCardColors = (
  data: FeatureCardData,
  imageUrl: URL | null,
) => {
  const theme = useTheme();
  const { shouldShowForTheme } = useThemeConditionsMet();
  const mode = data?.DisplayConditions?.mode;
  const { contrastTextColor } = useGetContrastTextColor(imageUrl?.href || '');

  // Determine base text color based on mode
  const baseTextColor = useMemo(() => {
    if (mode === 'dark') {
      return (theme.vars || theme).palette.white.main;
    }
    if (mode === 'light') {
      return (theme.vars || theme).palette.black.main;
    }
    return (theme.vars || theme).palette.text.primary;
  }, [mode, theme]);

  // Use contrast color if image exists, otherwise use base color
  const effectiveTextColor = imageUrl?.href ? contrastTextColor : baseTextColor;

  return useMemo(() => {
    const applyThemeOverride = (
      color: string | undefined,
      themeColor: string,
    ) => {
      return shouldShowForTheme ? themeColor : color || effectiveTextColor;
    };

    return {
      icon: effectiveTextColor,
      title: applyThemeOverride(
        data?.TitleColor,
        (theme.vars || theme).palette.text.primary,
      ),
      subtitle: applyThemeOverride(
        data?.SubtitleColor,
        (theme.vars || theme).palette.text.secondary,
      ),
      cta: applyThemeOverride(
        data?.CTAColor,
        (theme.vars || theme).palette.text.primary,
      ),
    };
  }, [
    data?.TitleColor,
    data?.SubtitleColor,
    data?.CTAColor,
    theme,
    effectiveTextColor,
    shouldShowForTheme,
  ]);
};

export const useFeatureCardImage = (data: FeatureCardData): URL | null => {
  const { mode: themeMode } = useColorScheme();
  return useMemo(() => {
    const mode = data?.DisplayConditions?.mode || themeMode;
    const baseUrl = getStrapiBaseUrl();

    if (!data?.BackgroundImageDark?.url || !data?.BackgroundImageLight?.url) {
      return null;
    }

    const imageUrl =
      mode === 'dark'
        ? data.BackgroundImageDark.url
        : data.BackgroundImageLight.url;

    return new URL(imageUrl, baseUrl);
  }, [
    data?.BackgroundImageDark?.url,
    data?.BackgroundImageLight?.url,
    data?.DisplayConditions?.mode,
    themeMode,
  ]);
};

export const useFeatureCardDisable = (data: FeatureCardData) => {
  const [setDisabledFeatureCard] = useSettingsStore((state) => [
    state.setDisabledFeatureCard,
  ]);

  // Disable on mount if showOnce is true
  useEffect(() => {
    if (data?.DisplayConditions?.showOnce && data?.uid) {
      setDisabledFeatureCard(data.uid);
    }
  }, [data?.DisplayConditions?.showOnce, data?.uid, setDisabledFeatureCard]);

  const disableCard = ({
    isShowOnce = false,
  }: { isShowOnce?: boolean } = {}) => {
    if ((!isShowOnce || data?.DisplayConditions?.showOnce) && data?.uid) {
      setDisabledFeatureCard(data.uid);
    }
  };

  return { disableCard };
};

export const useFeatureCardStyles = (): SxProps<Theme> => {
  const { shouldShowForTheme } = useThemeConditionsMet();

  return useMemo(
    () =>
      shouldShowForTheme
        ? {
            background: (theme: Theme) =>
              (theme.vars || theme).palette.surface1.main,
            border: (theme: Theme) => getSurfaceBorder(theme, 'surface1'),
          }
        : {},
    [shouldShowForTheme],
  );
};
